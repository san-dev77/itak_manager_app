import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret:
    process.env.JWT_SECRET || 'dev-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: process.env.JWT_ISSUER || 'itak-manager-api',
  audience: process.env.JWT_AUDIENCE || 'itak-manager-app',
}));
