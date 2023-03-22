import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) =>
    console.log('ERROR with the redis client', err)
);

export const connect = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log('Connected to Redis successfully');
        }
    } catch (err) {
        console.error('ERROR connecting to Redis:', err);
    }
};

export const disconnect = async () => {
    try {
        if (redisClient.isOpen) {
            await redisClient.disconnect();
            console.log('Disconnected from Redis successfully');
        }
    } catch (error) {
        console.error('ERROR disconnecting from Redis:', error);
    }
};

export const DEFAULT_CACHE_TIME = 60 * 60 * 24; // 24 hours
