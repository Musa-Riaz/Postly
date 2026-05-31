import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('API System Tests', () => {
  it('should return 200 OK on health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('should return 401 on protected account routes without token', async () => {
    const response = await request(app).get('/api/accounts');
    expect(response.status).toBe(401);
  });
});
