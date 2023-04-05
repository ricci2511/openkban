import { sortByLexoRankAsc } from '@lib/lexorank-helpers';
import { internalServerError, notFound } from '@server/helpers/error-helpers';
import { getSavedBoardById, saveBoard } from '@server/redis/board';
import { upsertBoardIds } from '@server/redis/user-board-ids';
import { BoardData } from 'types/board-types';
import { z } from 'zod';
import { BOARD_IDS_CACHE_ERROR, BOARD_METADATA_CACHE_ERROR } from '../errors';
import { queryColumnsWithTasks } from '@server/routers/board-column-router/routes/get-all-columns-with-tasks';
import { queryError } from '@server/routers/common-errors';
import { authedRateLimitedProcedure } from '@server/middlewares';

const sortTasksOfBoard = (board: BoardData): BoardData => {
    return {
        ...board,
        columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.sort(sortByLexoRankAsc),
        })),
    };
};

const idSchema = z.object({ id: z.string().cuid() });

export const getBoardById = authedRateLimitedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
        const boardId = input.id;

        const savedBoard = await getSavedBoardById(boardId);
        // if board metadata is cached, only query the columns with tasks
        if (savedBoard) {
            const columnsWithTasks = await queryColumnsWithTasks(
                ctx.prisma,
                boardId
            );

            return sortTasksOfBoard({
                ...savedBoard,
                columns: columnsWithTasks,
            });
        }

        try {
            const board = await ctx.prisma.board.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    columns: {
                        include: {
                            tasks: true,
                        },
                    },
                },
            });

            if (!board) throw notFound('Board not found');

            const { columns, ...metadata } = board;

            // cache board metadata
            await saveBoard(metadata).catch((error) => {
                throw internalServerError(BOARD_METADATA_CACHE_ERROR, error);
            });

            // conditionally cache the board ID for the user
            await upsertBoardIds(ctx.session.user.id, boardId).catch(
                (error) => {
                    throw internalServerError(BOARD_IDS_CACHE_ERROR, error);
                }
            );

            return sortTasksOfBoard(board);
        } catch (error) {
            const message = queryError('board', true);
            throw internalServerError(message, error);
        }
    });
