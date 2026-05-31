import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountService } from '../src/domains/accounts/account.service';
import { IAccountRepository } from '../src/domains/accounts/account.entity';

describe('AccountService Unit Tests', () => {
  let accountService: AccountService;
  let mockRepo: IAccountRepository;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    accountService = new AccountService(mockRepo);
  });

  it('should return connected accounts for a user', async () => {
    const mockAccounts = [{ id: '1', userId: 'u1', platform: 'x', handle: 'h1', zernioId: 'z1', displayName: 'D1', isActive: true, createdAt: new Date() }];
    vi.mocked(mockRepo.findByUserId).mockResolvedValue(mockAccounts);

    const result = await accountService.getConnectedAccounts('u1');
    expect(result).toEqual(mockAccounts);
    expect(mockRepo.findByUserId).toHaveBeenCalledWith('u1');
  });

  it('should throw error if disconnecting non-existent account', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    await expect(accountService.disconnectAccount('a1', 'u1')).rejects.toThrow('Account not found or unauthorized');
  });

  it('should throw error if disconnecting account belonging to another user', async () => {
    const mockAccount = { id: 'a1', userId: 'other-user', platform: 'x', handle: 'h1', zernioId: 'z1', displayName: 'D1', isActive: true, createdAt: new Date() };
    vi.mocked(mockRepo.findById).mockResolvedValue(mockAccount);

    await expect(accountService.disconnectAccount('a1', 'u1')).rejects.toThrow('Account not found or unauthorized');
  });
});
