import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface AnalyticsFilters {
  platform?: string;
  startDate?: string;
  endDate?: string;
}

export interface MetricValue {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
}

export interface AnalyticsOverview {
  metrics: {
    likes: MetricValue;
    comments: MetricValue;
    shares: MetricValue;
    saves: MetricValue;
    views: MetricValue;
    impressions: MetricValue;
    reach: MetricValue;
    clicks: MetricValue;
  };
  engagementRate: MetricValue;
  platformBreakdown: Array<{
    platform: string;
    posts: number;
    metrics: Record<string, number>;
    engagementRate: number;
  }>;
}

export interface DailyMetricData {
  date: string;
  metrics: {
    clicks: number;
    comments: number;
    impressions: number;
    likes: number;
    reach: number;
    saves: number;
    shares: number;
    views: number;
  };
  platforms?: Record<string, number>;
  postCount: number;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  status: string;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  mediaUrls?: string[];
  analytics?: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
    engagementRate: number;
  };
  platforms: Array<{
    platform: string;
    status: string;
    accountId: any;
  }>;
}

export interface PostListResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DailyResponse {
  dailyData: DailyMetricData[];
  platformBreakdown: Array<{
    platform: string;
    postCount: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
    impressions: number;
    reach: number;
    clicks: number;
    engagementRate: number;
  }>;
  totalMetrics: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
    impressions: number;
    reach: number;
    clicks: number;
  };
}

export interface AnalyticsInsights {
  bestTime: {
    slots: Array<{
      day_of_week: number;
      hour: number;
      avg_engagement: number;
      post_count: number;
    }>;
  };
  contentDecay: {
    buckets: Array<{
      bucket_order: number;
      bucket_label: string;
      avg_pct_of_final: number;
      post_count: number;
    }>;
  };
  postingFreq: {
    frequency: Array<{
      platform: string;
      posts_per_week: number;
      avg_engagement_rate: number;
      avg_engagement: number;
      weeks_count: number;
    }>;
  };
  followerStats: {
    accounts: Array<{
      _id: string;
      platform: string;
      username: string;
      currentFollowers: number;
      growth: number;
      growthPercentage: number;
      dataPoints: number;
    }>;
    stats: Record<string, Array<{ date: string; followers: number }>>;
    dateRange: { from: string; to: string };
    granularity: string;
  };
}

export const useAnalytics = (filters?: AnalyticsFilters) => {
  const fetchOverview = async (): Promise<AnalyticsOverview> => {
    const response = await apiClient.get('/analytics/overview', { params: filters });
    return response.data;
  };

  const fetchDaily = async (): Promise<DailyResponse> => {
    const response = await apiClient.get('/analytics/daily', { params: filters });
    return response.data;
  };

  const fetchInsights = async (): Promise<AnalyticsInsights> => {
    const response = await apiClient.get('/analytics/insights', { params: { platform: filters?.platform } });
    return response.data;
  };

  const fetchPosts = async (): Promise<Post[]> => {
    const response = await apiClient.get('/analytics/posts', { params: filters });
    return response.data.posts || [];
  };

  const overviewQuery = useQuery({
    queryKey: ['analytics-overview', filters],
    queryFn: fetchOverview,
  });

  const dailyQuery = useQuery({
    queryKey: ['analytics-daily', filters],
    queryFn: fetchDaily,
  });

  const insightsQuery = useQuery({
    queryKey: ['analytics-insights', filters?.platform],
    queryFn: fetchInsights,
  });

  const postsQuery = useQuery({
    queryKey: ['analytics-posts', filters],
    queryFn: fetchPosts,
  });

  return {
    overview: overviewQuery.data,
    daily: dailyQuery.data,
    insights: insightsQuery.data,
    posts: postsQuery.data,
    isLoading: overviewQuery.isLoading || dailyQuery.isLoading || insightsQuery.isLoading || postsQuery.isLoading,
    isError: overviewQuery.isError || dailyQuery.isError || insightsQuery.isError || postsQuery.isError,
    isFetching: overviewQuery.isFetching || dailyQuery.isFetching || insightsQuery.isFetching || postsQuery.isFetching,
    refetch: () => {
      overviewQuery.refetch();
      dailyQuery.refetch();
      insightsQuery.refetch();
      postsQuery.refetch();
    }
  };
};
