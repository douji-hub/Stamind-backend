import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(REDIS_URL);

export const WORKSPACE_CACHE_PREFIX = 'workspace:';

export const getWorkspaceCacheKey = (workspaceId: string) =>
    `${WORKSPACE_CACHE_PREFIX}${workspaceId}`;
