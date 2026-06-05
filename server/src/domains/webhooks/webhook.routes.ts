import { Router } from 'express';
import { WebhookController } from './webhook.controller.js';
import { PrismaPostRepository } from '../posts/post.repository.js';

const router = Router();
const postRepo = new PrismaPostRepository();
const webhookController = new WebhookController(postRepo);

router.post('/zernio', webhookController.handleZernioWebhook);

export default router;
