import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

// Dependency Injection
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

// Routes
router.use(authMiddleware);

router.get('/overview', analyticsController.getOverview);
router.get('/daily', analyticsController.getDaily);
router.get('/insights', analyticsController.getInsights);
router.get('/posts', analyticsController.getPosts);

export default router;
