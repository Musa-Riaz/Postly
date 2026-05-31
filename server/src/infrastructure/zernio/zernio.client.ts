import axios, { AxiosInstance } from 'axios';
import logger from '../../shared/utils/logger';
import dotenv from 'dotenv'
dotenv.config()

export interface ZernioAccountDetails {
  id: string;
  platform: string;
  handle: string;
  displayName: string;
  avatarUrl?: string | null;
}

class ZernioClient {
  private client: AxiosInstance;

  constructor() {
    const apiKey = process.env.ZERNIO_API_KEY;
    if (!apiKey) {
      logger.warn('ZERNIO_API_KEY is not defined');
    }

    this.client = axios.create({
      baseURL: 'https://api.zernio.com/v1',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generates the OAuth connection URL for a specific platform
   */
  async getConnectionUrl(platform: string, redirectUri: string): Promise<string> {
    try {
      const response = await this.client.post<{ url: string }>('/accounts/connect', {
        platform,
        redirect_uri: redirectUri,
      });
      return response.data.url;
    } catch (error: any) {
      logger.error(`Error fetching Zernio connection URL for ${platform}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Exchanges callback code for account details
   */
  async getAccountDetails(code: string): Promise<ZernioAccountDetails> {
    try {
      const response = await this.client.post<ZernioAccountDetails>('/accounts/callback', { code });
      return response.data; // Should return internal Zernio account ID and metadata
    } catch (error: any) {
      logger.error('Error fetching Zernio account details:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const zernioClient = new ZernioClient();
