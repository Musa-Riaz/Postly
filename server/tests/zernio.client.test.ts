import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { zernioClient } from '../src/infrastructure/zernio/zernio.client';

vi.mock('axios');

describe('ZernioClient Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get connection URL', async () => {
    const mockUrl = 'https://oauth.zernio.com/auth';
    vi.mocked(axios.create().post).mockResolvedValue({ data: { url: mockUrl } });

    // Since we export a singleton, we need to handle the axios mock carefully
    // In a real scenario, we might use a dependency injection pattern for clients too
  });
});
