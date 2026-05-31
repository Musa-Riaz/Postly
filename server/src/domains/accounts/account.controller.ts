import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { AccountService } from './account.service';
import logger from '../../shared/utils/logger';

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  getAccounts = async (req: AuthRequest, res: Response) => {
    try {
      const accounts = await this.accountService.getConnectedAccounts(req.user!.id);
      res.json(accounts);
    } catch (error: any) {
      logger.error('Error fetching accounts:', error);
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  };

  connect = async (req: AuthRequest, res: Response) => {
    const { platform, redirectUri } = req.body;
    if (!platform || !redirectUri) {
      return res.status(400).json({ error: 'Platform and redirectUri are required' });
    }

    try {
      const url = await this.accountService.getConnectUrl(platform, redirectUri);
      res.json({ url });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to initiate connection' });
    }
  };

  callback = async (req: AuthRequest, res: Response) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    try {
      const account = await this.accountService.handleCallback(req.user!.id, code);
      res.status(201).json(account);
    } catch (error: any) {
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
