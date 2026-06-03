import { IPostRepository, CreatePostDto, Post, PostFilterDto, PostSortDto } from './post.entity';
import { NotFoundError } from '../../shared/errors/AppError';
import { PostPublisher } from './post.publisher';
import { ZernioClient, zernio } from '../../infrastructure/zernio/zernio.client';

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
    const res = await this.zernioClient.deletePost(post.zernioPostId!);
    console.log(post.zernioPostId)
    console.log(res);
    await this.postRepo.delete(postId);
  }

  async publishPost(postId: string, userId: string) {
    return this.publisher.publish(postId, userId);
  }

  async schedulePost(postId: string, userId: string, scheduledFor: Date) {
    return this.publisher.publish(postId, userId, scheduledFor);
  }
}
