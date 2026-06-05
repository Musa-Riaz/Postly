import { Request, Response, NextFunction } from 'express';
import { IPostRepository } from '../posts/post.entity.js';
import logger from '../../shared/utils/logger.js';

export class WebhookController {
  constructor(private readonly postRepo: IPostRepository) {}

  handleZernioWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, data } = req.body;
      
      logger.info({ type, zernioPostId: data?.id }, 'Received Zernio webhook');

      // TODO: Verify webhook signature here

      const zernioPostId = data?.id;
      if (!zernioPostId) {
        return res.status(400).json({ error: 'Missing zernioPostId in webhook data' });
      }

      const post = await this.postRepo.findByZernioId(zernioPostId);
      if (!post) {
        logger.warn({ zernioPostId }, 'Post not found for webhook');
        return res.status(404).json({ error: 'Post not found' });
      }

      if (type === 'post.published') {
        await this.postRepo.update(post.id, { 
            status: 'PUBLISHED',
            publishedAt: new Date()
        });
        logger.info({ postId: post.id }, 'Post status updated to PUBLISHED via webhook');
      }

      if (type === 'post.failed') {
        await this.postRepo.update(post.id, { status: 'FAILED' });
        logger.info({ postId: post.id }, 'Post status updated to FAILED via webhook');
      }

      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  };
}
