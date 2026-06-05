import { Router } from 'express';
import { AccountController } from './account.controller.js';
import { AccountService } from './account.service.js';
import { AccountRepository } from './account.repository.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';

const router = Router();
const repository = new AccountRepository();
const service = new AccountService(repository);
const controller = new AccountController(service);

// Apply auth middleware to all account routes
router.use(authMiddleware);

router.get('/', controller.getAccounts);
router.post('/connect', controller.connect);
router.post('/callback', controller.callback);
router.delete('/:id', controller.disconnect);

export default router;
