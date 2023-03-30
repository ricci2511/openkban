import { createClient } from 'redis';

export const DEFAULT_EXPIRE_TIME = 60 * 60 * 24; // 24 hours

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

// Typed redis get commands
export const jsonGet = async <T>(
    key: string,
    path?: string
): Promise<T | null> => {
    try {
        const result = await redisClient.json.get(key, { path });
        if (!result) return null;
        return result as T;
    } catch (error) {
        console.error(`ERROR getting ${key} JSON from Redis:`, error);
        return null;
    }
};

export const hashGet = async <T>(
    key: string,
    field: string
): Promise<T | null> => {
    try {
        const result = await redisClient.hGet(key, field);
        if (!result) return null;
        return JSON.parse(result) as T;
    } catch (error) {
        console.error(
            `ERROR getting ${key} hash with field ${field} from Redis:`,
            error
        );
        return null;
    }
};

export const hashGetAll = async <T>(
    key: string
): Promise<{ [key: string]: T } | null> => {
    try {
        const result = await redisClient.hGetAll(key);
        if (!result) return null;
        const parsedResult: { [key: string]: T } = {};
        Object.entries(result).forEach(([key, value]) => {
            parsedResult[key] = JSON.parse(value);
        });
        return parsedResult;
    } catch (error) {
        console.error(`ERROR getting ${key} hash from Redis:`, error);
        return null;
    }
};
