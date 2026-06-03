import { Router } from 'express';
import { WebhookController } from './webhook.controller';
import { PrismaPostRepository } from '../posts/post.repository';

const router = Router();
const postRepo = new PrismaPostRepository();
const webhookController = new WebhookController(postRepo);

router.post('/zernio', webhookController.handleZernioWebhook);

export default router;
