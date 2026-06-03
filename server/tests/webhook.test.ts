import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { WebhookController } from '../src/domains/webhooks/webhook.controller';

const app = express();
app.use(express.json());

describe('WebhookController Unit Tests', () => {
  let mockPostRepo: any;
  let webhookController: WebhookController;
  let testApp: express.Application;

  beforeEach(() => {
    mockPostRepo = {
      findByZernioId: vi.fn(),
      update: vi.fn(),
    };
    webhookController = new WebhookController(mockPostRepo);
    
    testApp = express();
    testApp.use(express.json());
    
    const router = express.Router();
    router.post('/zernio', webhookController.handleZernioWebhook);
    testApp.use('/api/webhooks', router);
  });

  const mockPost: any = { id: 'post-1', zernioId: 'z-post-1', status: 'SCHEDULED' };

  it('should update post status to PUBLISHED on post.published event', async () => {
    vi.mocked(mockPostRepo.findByZernioId).mockResolvedValue(mockPost);

    const response = await request(testApp)
      .post('/api/webhooks/zernio')
      .send({
        type: 'post.published',
        data: { id: 'z-post-1' }
      });

    expect(response.status).toBe(200);
    expect(mockPostRepo.update).toHaveBeenCalledWith('post-1', expect.objectContaining({
      status: 'PUBLISHED',
      publishedAt: expect.any(Date)
    }));
  });

  it('should update post status to FAILED on post.failed event', async () => {
    vi.mocked(mockPostRepo.findByZernioId).mockResolvedValue(mockPost);

    const response = await request(testApp)
      .post('/api/webhooks/zernio')
      .send({
        type: 'post.failed',
        data: { id: 'z-post-1' }
      });

    expect(response.status).toBe(200);
    expect(mockPostRepo.update).toHaveBeenCalledWith('post-1', { status: 'FAILED' });
  });

  it('should return 404 if post not found', async () => {
    vi.mocked(mockPostRepo.findByZernioId).mockResolvedValue(null);

    const response = await request(testApp)
      .post('/api/webhooks/zernio')
      .send({
        type: 'post.published',
        data: { id: 'z-post-1' }
      });

    expect(response.status).toBe(404);
  });

  it('should return 400 if zernioPostId is missing', async () => {
    const response = await request(testApp)
      .post('/api/webhooks/zernio')
      .send({
        type: 'post.published',
        data: {}
      });

    expect(response.status).toBe(400);
  });
});
