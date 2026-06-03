import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostPublisher } from '../src/domains/posts/post.publisher';
import { IPostRepository } from '../src/domains/posts/post.entity';
import { ZernioClient } from '../src/infrastructure/zernio/zernio.client';
import { PostStatus } from '@prisma/client';

describe('PostPublisher Unit Tests', () => {
  let postPublisher: PostPublisher;
  let mockRepo: IPostRepository;
  let mockZernioClient: any;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByZernioId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockZernioClient = {
      publishPost: vi.fn(),
    };

    postPublisher = new PostPublisher(mockRepo, mockZernioClient);
  });

  const mockPost: any = {
    id: 'post-1',
    userId: 'user-1',
    content: 'Hello World',
    mediaUrls: ['https://example.com/img.jpg'],
    status: 'DRAFT' as PostStatus,
    accounts: [
      { platform: 'linkedin', zernioId: 'z-acc-1' }
    ]
  };

  it('should publish post immediately when no scheduledFor is provided', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockPost);
    vi.mocked(mockZernioClient.publishPost).mockResolvedValue({ id: 'z-post-1' });
    vi.mocked(mockRepo.update).mockImplementation((id, data) => Promise.resolve({ ...mockPost, ...data }));

    const result = await postPublisher.publish('post-1', 'user-1');

    expect(result.status).toBe('PUBLISHED');
    expect(result.zernioPostId).toBe('z-post-1');
    expect(mockZernioClient.publishPost).toHaveBeenCalledWith({
      content: mockPost.content,
      mediaUrls: mockPost.mediaUrls,
      accounts: [{ platform: 'linkedin', accountId: 'z-acc-1' }],
      scheduledFor: undefined
    });
  });

  it('should schedule post when scheduledFor is provided', async () => {
    const scheduledDate = new Date(Date.now() + 100000);
    vi.mocked(mockRepo.findById).mockResolvedValue(mockPost);
    vi.mocked(mockZernioClient.publishPost).mockResolvedValue({ id: 'z-post-1' });
    vi.mocked(mockRepo.update).mockImplementation((id, data) => Promise.resolve({ ...mockPost, ...data }));

    const result = await postPublisher.publish('post-1', 'user-1', scheduledDate);

    expect(result.status).toBe('SCHEDULED');
    expect(result.zernioPostId).toBe('z-post-1');
    expect(mockZernioClient.publishPost).toHaveBeenCalledWith(expect.objectContaining({
      scheduledFor: scheduledDate.toISOString()
    }));
  });

  it('should throw error if post not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    await expect(postPublisher.publish('post-1', 'user-1'))
      .rejects.toThrow('Post not found or unauthorized');
  });

  it('should throw error if post belongs to another user', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockPost);

    await expect(postPublisher.publish('post-1', 'user-2'))
      .rejects.toThrow('Post not found or unauthorized');
  });

  it('should update status to FAILED if Zernio call fails', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockPost);
    vi.mocked(mockZernioClient.publishPost).mockRejectedValue(new Error('Zernio API error'));

    await expect(postPublisher.publish('post-1', 'user-1'))
      .rejects.toThrow('Zernio API error');

    expect(mockRepo.update).toHaveBeenCalledWith('post-1', { status: 'FAILED' });
  });
});
