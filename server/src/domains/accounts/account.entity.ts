export interface SocialAccountEntity {
  id: string;
  userId: string;
  platform: string;
  zernioId: string;
  handle: string;
  displayName: string;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface IAccountRepository {
  findById(id: string): Promise<SocialAccountEntity | null>;
  findByUserId(userId: string): Promise<SocialAccountEntity[]>;
  create(data: Omit<SocialAccountEntity, 'id' | 'createdAt'>): Promise<SocialAccountEntity>;
  update(id: string, data: Partial<Omit<SocialAccountEntity, 'id' | 'userId' | 'createdAt'>>): Promise<SocialAccountEntity>;
  delete(id: string): Promise<void>;
}
