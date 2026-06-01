import { Zernio } from '@zernio/node';
import logger from '../../shared/utils/logger';
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
}

export const zernio = ZernioClient.getInstance();
