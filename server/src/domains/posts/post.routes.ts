import { Router } from 'express';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { PrismaPostRepository } from './post.repository.js';
import { PostPublisher } from './post.publisher.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Dependency Injection
const postRepo = new PrismaPostRepository();
const postPublisher = new PostPublisher(postRepo);
const postService = new PostService(postRepo, postPublisher);
const postController = new PostController(postService);

// Routes
router.use(authMiddleware);

router.post('/', postController.createPost);
router.get('/', postController.getUserPosts);
router.get('/:id', postController.getPostById);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/publish', postController.publishPost);
router.post('/:id/schedule', postController.schedulePost);

export default router;
