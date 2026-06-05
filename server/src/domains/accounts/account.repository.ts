import { IAccountRepository, SocialAccountEntity } from './account.entity.js';
import prisma from '../../infrastructure/prisma/client.js';

export class AccountRepository implements IAccountRepository {
  async findById(id: string): Promise<SocialAccountEntity | null> {
    return prisma.socialAccount.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<SocialAccountEntity[]> {
    return prisma.socialAccount.findMany({ where: { userId } });
  }

  async create(data: Omit<SocialAccountEntity, 'id' | 'createdAt'>): Promise<SocialAccountEntity> {
    return prisma.socialAccount.create({ data });
  }

  async update(id: string, data: Partial<Omit<SocialAccountEntity, 'id' | 'userId' | 'createdAt'>>): Promise<SocialAccountEntity> {
    return prisma.socialAccount.update({
      where: { id },
      data: data as any,
    }) as unknown as Promise<SocialAccountEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.socialAccount.delete({ where: { id } });
  }
}
