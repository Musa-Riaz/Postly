import { ZernioClient, zernio } from '../../infrastructure/zernio/zernio.client';
import { IPostRepository, Post } from './post.entity';
import logger from '../../shared/utils/logger';

export class PostPublisher {
  constructor(
    private readonly postRepo: IPostRepository,
    private readonly zernioClient: ZernioClient = zernio
  ) {}

  /**
   * Publishes a post and updates its status in the database.
   * If scheduledFor is provided, it schedules the post via Zernio.
   */
  async publish(postId: string, userId: string, scheduledFor?: Date): Promise<Post> {
    const post = await this.postRepo.findById(postId);
    if (!post || post.userId !== userId) {
      throw new Error('Post not found or unauthorized');
    }

    if (post.status === 'PUBLISHED' && !scheduledFor) {
        throw new Error('Post is already published');
    }

    const accounts = post.accounts?.map((acc: any) => ({
      platform: acc.platform,
      accountId: acc.zernioId
    })) || [];

    if (accounts.length === 0) {
      throw new Error('No accounts connected to this post');
    }

    try {
      const response = await this.zernioClient.publishPost({
        content: post.content,
        mediaUrls: post.mediaUrls,
        accounts,
        scheduledFor: scheduledFor?.toISOString(),
      });

      const updatedPost = await this.postRepo.update(postId, {
        status: scheduledFor ? 'SCHEDULED' : 'PUBLISHED',
        scheduledAt: scheduledFor || post.scheduledAt,
        publishedAt: scheduledFor ? undefined : new Date(),
        zernioPostId: response.post.id || response.post._id,
      });

      logger.info({ postId, status: updatedPost.status }, 'Post publishing/scheduling initiated');
      return updatedPost;
    } catch (error: any) {
      logger.error({ postId, error: error.message }, 'Failed to publish/schedule post');
      await this.postRepo.update(postId, { status: 'FAILED' });
      throw error;
    }
  }
}
