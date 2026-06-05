import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware.js';
import { AccountService } from './account.service.js';
import logger from '../../shared/utils/logger.js';

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  getAccounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accounts = await this.accountService.getConnectedAccounts(req.user!.id);
      res.json(accounts);
    } catch (error: any) {
      next(error);
    }
  };

  connect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { platform, redirectUri } = req.body;
    if (!platform || !redirectUri) {
      return res.status(400).json({ error: 'Platform and redirectUri are required' });
    }

    try {
      const url = await this.accountService.getConnectUrl(req.user!.id, platform, redirectUri);
      res.json({ url });
    } catch (error: any) {
      next(error);
    }
  };

  callback = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Note: 'code' is optional now because Zernio Standard mode uses direct account details in redirect params
    // But we use the sync/list approach in handleCallback which doesn't strictly need the code here.
    try {
      const accounts = await this.accountService.handleCallback(req.user!.id);
      res.status(201).json(accounts);
    } catch (error: any) {
      logger.error({ error }, 'Controller: Failed to complete connection');
      res.status(500).json({ error: 'Failed to complete connection' });
    }
  };

  disconnect = async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    try {
      await this.accountService.disconnectAccount(id, req.user!.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
