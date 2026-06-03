import { Router } from 'express';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaPostRepository } from './post.repository';
import { PostPublisher } from './post.publisher';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

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
