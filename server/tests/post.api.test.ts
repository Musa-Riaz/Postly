import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { PostController } from '../src/domains/posts/post.controller.js';

// Create a mock app for testing the controller
const app = express();
app.use(express.json());

// Mock AuthRequest middleware
const mockAuthMiddleware = (req: any, res: any, next: any) => {
  req.user = { id: 'user-1', email: 'test@example.com' };
  next();
};

describe('PostController API Tests', () => {
  let mockPostService: any;
  let postController: PostController;
  let testApp: express.Application;

  beforeEach(() => {
    mockPostService = {
      publishPost: vi.fn(),
      schedulePost: vi.fn(),
    };
    postController = new PostController(mockPostService);
    
    testApp = express();
    testApp.use(express.json());
    
    const router = express.Router();
    router.post('/:id/publish', mockAuthMiddleware, postController.publishPost);
    router.post('/:id/schedule', mockAuthMiddleware, postController.schedulePost);
    testApp.use('/api/posts', router);
  });

  it('POST /api/posts/:id/publish should return 200 and published post', async () => {
    const mockPost = { id: 'post-1', status: 'PUBLISHED' };
    vi.mocked(mockPostService.publishPost).mockResolvedValue(mockPost);

    const response = await request(testApp)
      .post('/api/posts/post-1/publish')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPost);
  });

  it('POST /api/posts/:id/schedule should return 200 and scheduled post', async () => {
    const mockPost = { id: 'post-1', status: 'SCHEDULED', scheduledAt: '2025-01-01T10:00:00Z' };
    vi.mocked(mockPostService.schedulePost).mockResolvedValue(mockPost);

    const response = await request(testApp)
      .post('/api/posts/post-1/schedule')
      .send({ scheduledAt: '2025-01-01T10:00:00Z' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPost);
  });

  it('POST /api/posts/:id/schedule should return 500 if scheduledAt is missing', async () => {
    const response = await request(testApp)
      .post('/api/posts/post-1/schedule')
      .send({});

    expect(response.status).toBe(500);
  });
});
