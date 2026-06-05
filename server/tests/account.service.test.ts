import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountService } from '../src/domains/accounts/account.service.js';
import { IAccountRepository, SocialAccountEntity } from '../src/domains/accounts/account.entity.js';
import { NotFoundError } from '../src/shared/errors/AppError.js';

describe('AccountService Unit Tests', () => {
  let accountService: AccountService;
  let mockRepo: IAccountRepository;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    accountService = new AccountService(mockRepo);
  });

  it('should return connected accounts for a user', async () => {
    const mockAccounts: SocialAccountEntity[] = [];
    vi.mocked(mockRepo.findByUserId).mockResolvedValue(mockAccounts);

    const result = await accountService.getConnectedAccounts('user-1');
    expect(result).toEqual(mockAccounts);
    expect(mockRepo.findByUserId).toHaveBeenCalledWith('user-1');
  });

  it('should throw NotFoundError if disconnecting non-existent account', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    await expect(accountService.disconnectAccount('acc-1', 'user-1'))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if disconnecting account belonging to another user', async () => {
    const mockAccount: SocialAccountEntity = {
      id: 'acc-1',
      userId: 'user-2',
      platform: 'twitter',
      zernioId: 'z-1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(mockRepo.findById).mockResolvedValue(mockAccount);

    await expect(accountService.disconnectAccount('acc-1', 'user-1'))
      .rejects.toThrow(NotFoundError);
  });
});
