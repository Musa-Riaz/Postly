import { IAccountRepository } from './account.entity';
import { zernioClient } from '../../infrastructure/zernio/zernio.client';
import logger from '../../shared/utils/logger';

export class AccountService {
  constructor(private readonly accountRepo: IAccountRepository) {}

  async getConnectedAccounts(userId: string) {
    return this.accountRepo.findByUserId(userId);
  }

  async getConnectUrl(platform: string, redirectUri: string) {
    return zernioClient.getConnectionUrl(platform, redirectUri);
  }

  async handleCallback(userId: string, code: string) {
    try {
      const zernioData = await zernioClient.getAccountDetails(code);
      
      // Map Zernio response to our SocialAccountEntity
      return this.accountRepo.create({
        userId,
        platform: zernioData.platform,
        zernioId: zernioData.id,
        handle: zernioData.handle,
        displayName: zernioData.displayName,
        avatarUrl: zernioData.avatarUrl,
        isActive: true,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to handle Zernio callback');
      throw error;
    }
  }

  async disconnectAccount(accountId: string, userId: string) {
    const account = await this.accountRepo.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new Error('Account not found or unauthorized');
    }
    return this.accountRepo.delete(accountId);
  }
}
