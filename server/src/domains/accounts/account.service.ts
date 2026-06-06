import { IAccountRepository } from './account.entity.js';
import { zernio } from '../../infrastructure/zernio/zernio.client.js';
import logger from '../../shared/utils/logger.js';
import { NotFoundError, AuthenticationError } from '../../shared/errors/AppError.js';
import prisma from '../../infrastructure/prisma/client.js';

export class AccountService {
  constructor(private readonly accountRepo: IAccountRepository) {}

  async getConnectedAccounts(userId: string) {
    return this.accountRepo.findByUserId(userId);
  }

  /**
   * Generates a connection URL, ensuring a Zernio Profile exists for the user first.
   * Implements "Just-in-Time" provisioning for the User record.
   */
  async getConnectUrl(userId: string, platform: string, redirectUri: string) {
    const authUser = await prisma.user.findUnique({ where: { id: userId } });
    
    let zernioProfileId = authUser?.zernioProfileId;

    // 1. If user doesn't exist in our DB, or exists but without a profile, provision them
    if (!authUser || !zernioProfileId) {
      if (!zernioProfileId) {
        logger.info(`Creating new Zernio profile for user ${userId}`);
        zernioProfileId = await zernio.createProfile(`${userId}'s Postly Workspace`);
      }

      //get users email to update the user record
      const user = await prisma.user.findUnique({where: {id: userId}})

      // Upsert user record to handle JIT provisioning
      const updatedUser = await prisma.user.upsert({
        where: { id: userId },
        update: { zernioProfileId },
        create: {   
          id: userId, 
          email: user?.email || 'user@temp.com', 
          zernioProfileId 
        }
      });
      zernioProfileId = updatedUser.zernioProfileId!;
    }

    // 2. Generate the connection URL using the Profile ID
    return zernio.getConnectUrl(platform, zernioProfileId, redirectUri);
  }

  async handleCallback(userId: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.zernioProfileId) {
        throw new Error('User does not have a Zernio profile');
      }

      // 1. Fetch newly connected accounts from Zernio
      const zernioAccounts = await zernio.listAccounts(user.zernioProfileId);
      
      // 2. Sync them to our DB
      const syncedAccounts = [];
      for (const za of zernioAccounts) {
        // Find existing account to avoid duplicates
        const existing = await prisma.socialAccount.findFirst({
          where: { zernioId: za._id }
        });

        if (existing) {
          // Update existing
          const updated = await prisma.socialAccount.update({
            where: { id: existing.id },
            data: {
              handle: za.username || za.displayName || 'Account',
              displayName: za.displayName || za.username || 'Account',
              avatarUrl: za.profilePicture,
              isActive: za.isActive,
            }
          });
          syncedAccounts.push(updated);
        } else {
          // Create new
          const created = await prisma.socialAccount.create({
            data: {
              userId,
              platform: za.platform,
              zernioId: za._id,
              handle: za.username || za.displayName || 'Account',
              displayName: za.displayName || za.username || 'Account',
              avatarUrl: za.profilePicture,
              isActive: za.isActive,
            }
          });
          syncedAccounts.push(created);
        }
      }

      return syncedAccounts;
    } catch (error) {
      logger.error({ error }, 'Failed to handle Zernio callback/sync');
      throw error;
    }
  }

  async disconnectAccount(accountId: string, userId: string) {
    const account = await this.accountRepo.findById(accountId);
    if (!account) {
      throw new NotFoundError('Social account not found');
    }
    if (account.userId !== userId) {
      throw new NotFoundError('Social account not found');
    }
    await zernio.disconnectAccount(account.zernioId);
    return this.accountRepo.delete(accountId);
  }
}
