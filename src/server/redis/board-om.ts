import { EntityId, Repository, Schema } from 'redis-om';
import { redisClient, connect, DEFAULT_CACHE_TIME } from '.';
import { userRepository, CachedUser } from './user-om';
import { Board } from '@prisma/client';

const boardSchema = new Schema('board', {
    id: { type: 'string' },
    title: { type: 'string' },
    isFavourite: { type: 'boolean' },
    createdAt: { type: 'date' },
    lastInteractedAt: { type: 'date' },
    userId: { type: 'string' },
});

export const boardRepository = new Repository(boardSchema, redisClient);

export const getCachedBoards = async (userId: string) => {
    // fetch the board IDs available to the user
    const { boardIds } = (await userRepository.fetch(userId)) as CachedUser;
    // if no board IDs, return null
    if (!boardIds || !boardIds.length) return null;

    let boards: Board[] = [];
    let missingBoardIds: string[] = [];
    try {
        const boardEntities = await boardRepository.fetch(boardIds);
        for (const entity of boardEntities) {
            const board = entity as Board;
            if (!board.id) {
                // see: https://github.com/redis/redis-om-node#missing-entities-and-null-values
                entity[EntityId]
                    ? missingBoardIds.push(entity[EntityId])
                    : null;
            } else {
                boards.push(board);
            }
        }
        return { boards, missingBoardIds, error: null };
    } catch (error) {
        return { boards, missingBoardIds, error };
    }
};

export const cacheBoard = async (board: Board) => {
    await boardRepository.save(board.id, board);
    await boardRepository.expire(board.id, DEFAULT_CACHE_TIME);
};

export const invalidateBoard = async (boardId: string) => {
    await boardRepository.remove(boardId);
};
