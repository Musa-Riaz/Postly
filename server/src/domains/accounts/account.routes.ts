import { Router } from 'express';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

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
