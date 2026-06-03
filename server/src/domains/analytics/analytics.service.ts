import { ZernioClient, zernio } from '../../infrastructure/zernio/zernio.client';
import prisma from '../../infrastructure/prisma/client';
import logger from '../../shared/utils/logger';
import { NotFoundError } from '../../shared/errors/AppError';
import { platform } from 'node:os';

export interface AnalyticsFilters {
  platform?: string;
  startDate?: string;
  endDate?: string;
}

export class AnalyticsService {
  constructor(private readonly zernioClient: ZernioClient = zernio) {}

  private async getProfileId(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { zernioProfileId: true }
    });

    if (!user?.zernioProfileId) {
      throw new NotFoundError('Zernio profile not found for user');
    }

    return user.zernioProfileId;
  }

  async getOverview(userId: string, filters: AnalyticsFilters) {
    const profileId = await this.getProfileId(userId);
    const data = await this.zernioClient.getAnalytics({
      profileId,
      platform: filters.platform,
      startDate: filters.startDate,
      endDate: filters.endDate
    });
    return data;
  }

  async getDaily(userId: string, filters: AnalyticsFilters) {
    const profileId = await this.getProfileId(userId);
    const data = await this.zernioClient.getDailyMetrics({
      profileId,
      platform: filters.platform,
      startDate: filters.startDate,
      endDate: filters.endDate
    });

    // Calculate total metrics across all platforms for the overview counters
    const totalMetrics = (data.platformBreakdown || []).reduce((acc: any, curr: any) => {
      return {
        likes: (acc.likes || 0) + (curr.likes || 0),
        comments: (acc.comments || 0) + (curr.comments || 0),
        shares: (acc.shares || 0) + (curr.shares || 0),
        saves: (acc.saves || 0) + (curr.saves || 0),
        views: (acc.views || 0) + (curr.views || 0),
        impressions: (acc.impressions || 0) + (curr.impressions || 0),
        reach: (acc.reach || 0) + (curr.reach || 0),
        clicks: (acc.clicks || 0) + (curr.clicks || 0),
      };
    }, {});

    return {
      ...data,
      totalMetrics
    };
  }

  async getInsights(userId: string, platform?: string) {
    const profileId = await this.getProfileId(userId);
    
    // Fetch insights in parallel
    const [bestTime, contentDecay, postingFreq, followerStats] = await Promise.all([
      this.zernioClient.getBestTimeToPost({ profileId, platform }),
      this.zernioClient.getContentDecay({ profileId, platform }),
      this.zernioClient.getPostingFrequency({ profileId, platform }),
      this.zernioClient.getFollowerStats({ profileId, platform })
    ]);

    return {
      bestTime,
      contentDecay,
      postingFreq,
      followerStats
    };
  }

  async getPosts(userId: string, filters: AnalyticsFilters) {
    const profileId = await this.getProfileId(userId);
    const data = await this.zernioClient.listPosts({
      profileId,
      platform: filters.platform,
      limit: 50
    });
    console.log('this is the profile id', profileId, filters.platform)
    return data;
  }
}
