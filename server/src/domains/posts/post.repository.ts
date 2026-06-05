import { PrismaClient } from '@prisma/client';
import { IPostRepository, CreatePostDto, Post, PostFilterDto, PostSortDto } from './post.entity.js';
import prisma from '../../infrastructure/prisma/client.js';

export class PrismaPostRepository implements IPostRepository {
  private prisma: PrismaClient = prisma;

  async create(data: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data: {
        userId: data.userId,
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        platformSettings: data.platformSettings || {},
        scheduledAt: data.scheduledAt,
        accounts: {
          connect: data.accountIds.map(id => ({ id }))
        }
      }
    }) as unknown as Post;
  }

  async findById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { accounts: true }
    }) as unknown as Post | null;
  }

  async findByUserId(userId: string, options?: { filter?: PostFilterDto; sort?: PostSortDto }): Promise<Post[]> {
    const { filter, sort } = options || {};
    
    // Build where clause
    const where: any = { userId };
    
    if (filter) {
      if (filter.status) {
        where.status = filter.status;
      }
      
      if (filter.platform) {
        where.accounts = {
          some: {
            platform: filter.platform
          }
        };
      }
      
      if (filter.search) {
        where.content = {
          contains: filter.search,
          mode: 'insensitive'
        };
      }
      
      if (filter.startDate || filter.endDate) {
        where.createdAt = {};
        if (filter.startDate) where.createdAt.gte = filter.startDate;
        if (filter.endDate) where.createdAt.lte = filter.endDate;
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.order;
    } else {
      orderBy.createdAt = 'desc';
    }

    return this.prisma.post.findMany({
      where,
      orderBy,
      include: { accounts: true }
    }) as unknown as Post[];
  }

  async findByZernioId(zernioPostId: string): Promise<Post | null> {
    return this.prisma.post.findFirst({
        where: { zernioPostId },
        include: { accounts: true }
    }) as unknown as Post | null;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data: data as any
    }) as unknown as Post;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id }
    });
  }
}
