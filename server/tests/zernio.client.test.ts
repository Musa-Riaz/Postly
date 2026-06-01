import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios BEFORE importing the client
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn().mockReturnValue({
        post: vi.fn(),
        get: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }),
    },
  };
});

import { zernioClient } from '../src/infrastructure/zernio/zernio.client';

describe('ZernioClient Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get connection URL', async () => {
    const mockUrl = 'https://oauth.zernio.com/auth';
    const mockAxiosInstance = vi.mocked(axios.create)();
    vi.mocked(mockAxiosInstance.post).mockResolvedValueOnce({ data: { url: mockUrl } });

    const result = await zernioClient.getConnectionUrl('twitter', 'http://localhost/callback');
    expect(result).toBe(mockUrl);
    expect(mockAxiosInstance.post).toHaveBeenCalled();
  });
});
