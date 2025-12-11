import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'itak_manager:',
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // 1 hour default
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  lazyConnect: true,
}));

// REDIS_URL=redis://localhost:6379
// REDIS_HOST=localhost
// REDIS_PORT=6379
// REDIS_DB=0
// REDIS_KEY_PREFIX=itak_manager:
// REDIS_TTL=3600
