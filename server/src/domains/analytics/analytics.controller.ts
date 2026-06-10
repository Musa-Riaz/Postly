import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  getOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const filters = {
        platform: req.query.platform as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const data = await this.analyticsService.getOverview(userId, filters);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getDaily = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const filters = {
        platform: req.query.platform as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const data = await this.analyticsService.getDaily(userId, filters);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getInsights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const platform = req.query.platform as string;

      const data = await this.analyticsService.getInsights(userId, platform);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const filters = {
        platform: req.query.platform as string,
      };

      const data = await this.analyticsService.getPosts(userId, filters);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const postId = req.params.postId;

      const data = await this.analyticsService.getPost(userId, postId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
