import { Zernio } from '@zernio/node';
import logger from '../../shared/utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export class ZernioClient {
  private static instance: ZernioClient;
  private client: Zernio;

  private constructor() {
    const apiKey = process.env.ZERNIO_API_KEY;
    if (!apiKey) {
      console.log(process.env.ZERNIO_API_KEY)
      throw new Error('ZERNIO_API_KEY is not defined in environment variables');
    }
    this.client = new Zernio({ apiKey });
  }

  public static getInstance(): ZernioClient {
    if (!ZernioClient.instance) {
      ZernioClient.instance = new ZernioClient();
    }
    return ZernioClient.instance;
  }

  /**
   * Creates a new Zernio profile for a user/workspace, or returns existing if name matches.
   */
  async createProfile(name: string): Promise<string> {
    try {
      // 1. Check if profile already exists to avoid 409 conflict
      const { data: listResponse } = await this.client.profiles.listProfiles();
      const existing = listResponse?.profiles?.find((p: any) => p.name === name);
      
      if (existing?._id) {
        logger.info({ profileId: existing._id }, 'Found existing Zernio profile');
        return existing._id;
      }

      // 2. Create if it doesn't exist
      const { data: createResponse } = await this.client.profiles.createProfile({
        body: {
          name,
          color: '#3b82f6', // Brand primary color (blue-500)
        }
      });
      
      if (!createResponse?.profile?._id) {
        throw new Error('Failed to retrieve profile ID from Zernio response');
      }
      
      return createResponse.profile._id;
    } catch (error: any) {
      logger.error('Error in Zernio profile management:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generates a connection URL for a social platform
   */
  async getConnectUrl(platform: any, profileId: string, redirectUri: string): Promise<string> {
    try {
      const { data } = await this.client.connect.getConnectUrl({
        path: { platform },
        query: { 
            profileId,
            redirect_url: redirectUri 
        },
      });
      
      if (!data?.authUrl) {
        throw new Error('Failed to retrieve connect URL from Zernio response');
      }
      
      return data.authUrl;
    } catch (error: any) {
      logger.error(`Error fetching Zernio connection URL for ${platform}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches all connected accounts for a profile
   */
  async listAccounts(profileId: string): Promise<any[]> {
    try {
      const { data } = await this.client.accounts.listAccounts({
        query: { profileId }
      });
      return data.accounts || [];
    } catch (error: any) {
      logger.error('Error listing Zernio accounts:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Publishes or schedules a post across one or more platforms
   */
  async publishPost(data: {
    content: string;
    mediaUrls?: string[];
    accounts: { platform: string, accountId: string }[];
    scheduledFor?: string; // ISO 8601 timestamp
  }): Promise<any> {
    try {
      const { data: response } = await this.client.posts.createPost({
        body: {
          content: data.content,
          platforms: data.accounts,
          media: data.mediaUrls?.map(url => ({ url })),
          scheduledFor: data.scheduledFor,
        }
      });
      return response;
    } catch (error: any) {
      logger.error('Error publishing post via Zernio:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Delete a post across one or more platforms
   */
  async deletePost(postId: string): Promise<any> {
    try {
      logger.info({postId}, "Deleting post via Zernio")
      const { data } = await this.client.posts.deletePost({
        path: {
          postId
        }
      });
      return data;
    } catch (error: any) {
      logger.error('Error deleting post via Zernio:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches overall aggregated analytics
   */
  async getAnalytics(query: { profileId: string; platform?: string; startDate?: string; endDate?: string }): Promise<any> {
    try {
      const { data } = await this.client.analytics.getAnalytics({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error fetching Zernio analytics:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches daily performance metrics for time-series charts
   */
  async getDailyMetrics(query: { profileId: string; platform?: string; startDate?: string; endDate?: string }): Promise<any> {
    try {
      const { data } = await this.client.analytics.getDailyMetrics({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error fetching Zernio daily metrics:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches best time to post heatmap data
   */
  async getBestTimeToPost(query: { profileId: string; platform?: string }): Promise<any> {
    try {
      const { data } = await this.client.analytics.getBestTimeToPost({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error fetching Zernio best time to post:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches content performance decay data
   */
  async getContentDecay(query: { profileId: string; platform?: string }): Promise<any> {
    try {
      const { data } = await this.client.analytics.getContentDecay({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error fetching Zernio content decay:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches posting frequency vs engagement impact
   */
  async getPostingFrequency(query: { profileId: string; platform?: string }): Promise<any> {
    try {
      const { data } = await this.client.analytics.getPostingFrequency({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error fetching Zernio posting frequency:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches follower growth stats
   */
  async getFollowerStats(query: { profileId: string; platform?: string }): Promise<any> {
    try {
      const { data } = await this.client.accounts.getFollowerStats({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error fetching Zernio follower stats:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Fetches posts with analytics for a profile
   */
  async listPosts(query: { profileId: string; platform?: string; status?: string; limit?: number; offset?: number }): Promise<any> {
    try {
      const { data } = await this.client.posts.listPosts({
        query
      });
      return data;
    } catch (error: any) {
      logger.error('Error listing Zernio posts:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Disconnects an account from Zernio
   */
  async disconnectAccount(accountId: string): Promise<any> {
    try {
      const { data } = await this.client.accounts.deleteAccount({
        path: { accountId }
      });
      return data;
    } catch (error: any) {
      logger.error('Error disconnecting Zernio account:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const zernio = ZernioClient.getInstance();
