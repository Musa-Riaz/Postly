import { IPostRepository, CreatePostDto, Post, PostFilterDto, PostSortDto } from './post.entity.js';
import { NotFoundError } from '../../shared/errors/AppError.js';
import { PostPublisher } from './post.publisher.js';
import { ZernioClient, zernio } from '../../infrastructure/zernio/zernio.client.js';

export class PostService {
  constructor(
    private readonly postRepo: IPostRepository,
    private readonly publisher: PostPublisher,
    private readonly zernioClient: ZernioClient = zernio
  ) {}

  async createPost(data: CreatePostDto) {
    return this.postRepo.create(data);
  }

  async getUserPosts(userId: string, options?: { filter?: PostFilterDto; sort?: PostSortDto }) {
    return this.postRepo.findByUserId(userId, options);
  }

  async getPostById(postId: string, userId: string) {
    const post = await this.postRepo.findById(postId);
    if (!post || post.userId !== userId) {
      throw new NotFoundError('Post not found');
    }
    return post;
  }

  async updatePost(postId: string, userId: string, data: Partial<Post>) {
    const post = await this.getPostById(postId, userId);
    return this.postRepo.update(postId, data);
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.getPostById(postId, userId);
    //First delete the post from supabase
    await this.postRepo.delete(postId);
    await this.zernioClient.deletePost(post.zernioPostId!);
  }

  async publishPost(postId: string, userId: string) {
    return this.publisher.publish(postId, userId);
  }

  async schedulePost(postId: string, userId: string, scheduledFor: Date) {
    return this.publisher.publish(postId, userId, scheduledFor);
  }

  async syncUserPosts(userId: string) {
    // 1. Get the user's Zernio profile ID
    // Use prisma directly for a moment to get the user
    const dbUser = await (this.postRepo as any).prisma.user.findUnique({
      where: { id: userId }
    });

    if (!dbUser?.zernioProfileId) return;

    // 2. Fetch posts from Zernio
    try {
      const zernioPostsResponse = await this.zernioClient.listPosts({
        profileId: dbUser.zernioProfileId,
        limit: 50
      });

      const zernioPosts = zernioPostsResponse.posts || [];

      // 3. Update our DB for each post
      for (const zPost of zernioPosts) {
        const localPost = await this.postRepo.findByZernioId(zPost.id || zPost._id);
        if (localPost) {
          const newStatus = zPost.status?.toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' : localPost.status;
          
          await this.postRepo.update(localPost.id, {
            status: newStatus as any,
            publishedAt: zPost.publishedAt ? new Date(zPost.publishedAt) : localPost.publishedAt,
          });

          // 4. Fetch analytics separately 
          if (newStatus === 'PUBLISHED') {
            try {
              const analyticsResult = await this.zernioClient.getAnalytics({
                profileId: dbUser.zernioProfileId,
                postId: zPost.id || zPost._id
              } as any);
              
              const stats = analyticsResult.analytics || analyticsResult;

              if (stats) {
                await (this.postRepo as any).prisma.postAnalytics.upsert({
                  where: { postId: localPost.id },
                  create: {
                    postId: localPost.id,
                    impressions: stats.impressions || 0,
                    likes: stats.likes || 0,
                    comments: stats.comments || 0,
                    shares: stats.shares || 0,
                    reach: stats.reach || 0,
                  },
                  update: {
                    impressions: stats.impressions || 0,
                    likes: stats.likes || 0,
                    comments: stats.comments || 0,
                    shares: stats.shares || 0,
                    reach: stats.reach || 0,
                    lastFetchedAt: new Date(),
                  }
                });
              }
            } catch (err) {
              console.error(`Failed to fetch analytics for zernio post ${zPost.id}:`, err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync posts:', error);
    }
  }
}
