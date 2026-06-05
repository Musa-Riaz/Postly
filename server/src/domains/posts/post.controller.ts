import { Response, NextFunction } from 'express';
import { PostService } from './post.service.js';
import { AuthenticationError } from '../../shared/errors/AppError.js';
import { AuthRequest } from '../../shared/middleware/auth.middleware.js';

export class PostController {
  constructor(private readonly postService: PostService) {}

  createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const post = await this.postService.createPost({
        ...req.body,
        userId
      });

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  getUserPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const { status, platform, search, startDate, endDate, sortBy, order } = req.query;

      const options = {
        filter: {
          status: status as any,
          platform: platform as string,
          search: search as string,
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
        },
        sort: sortBy ? {
          field: sortBy as any,
          order: (order || 'desc') as 'asc' | 'desc'
        } : undefined
      };

      const posts = await this.postService.getUserPosts(userId, options);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const post = await this.postService.getPostById(req.params.id as string, userId);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const post = await this.postService.updatePost(req.params.id as string, userId, req.body);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      await this.postService.deletePost(req.params.id as string, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  publishPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const post = await this.postService.publishPost(req.params.id as string, userId);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

  schedulePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AuthenticationError('User not authenticated');

      const { scheduledAt } = req.body;
      if (!scheduledAt) throw new Error('scheduledAt is required');

      const post = await this.postService.schedulePost(req.params.id as string, userId, new Date(scheduledAt));
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

}
