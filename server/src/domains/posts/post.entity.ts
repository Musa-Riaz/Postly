import { PostStatus } from '@prisma/client';

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  platformSettings?: any;
  status: PostStatus;
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  zernioPostId: string;
  triggerJobId?: string | null;
  createdAt: Date;
  accounts?: any[];
}

export interface CreatePostDto {
  userId: string;
  accountIds: string[];
  content: string;
  mediaUrls?: string[];
  platformSettings?: any;
  scheduledAt?: Date;
}

export interface PostFilterDto {
  status?: PostStatus;
  platform?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PostSortDto {
  field: 'createdAt' | 'scheduledAt' | 'publishedAt';
  order: 'asc' | 'desc';
}

export interface IPostRepository {
  create(data: CreatePostDto): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByUserId(userId: string, options?: { filter?: PostFilterDto; sort?: PostSortDto }): Promise<Post[]>;
  findByZernioId(zernioPostId: string): Promise<Post | null>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
}
