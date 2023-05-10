import { sortByLexoRankAsc } from '@lib/lexorank-helpers';
import {
    forbidden,
    internalServerError,
    notFound,
} from '@server/helpers/error-helpers';
import {
    BoardData,
    ClientColumn,
    ClientTask,
    TasksMap,
    UnnormalizedBoardData,
} from 'types/board-types';
import { z } from 'zod';
import { queryError } from '@server/routers/common-errors';
import { authedRateLimitedProcedure } from '@server/middlewares';

const normalizeBoardData = (board: UnnormalizedBoardData): BoardData => {
    const tasksMap: TasksMap = {};

    const columns = board.columns.map(({ tasks, ...column }) => {
        tasksMap[column.id] = tasks.sort(sortByLexoRankAsc) as ClientTask[];
        return column as ClientColumn;
    });

    const { boardUser, memberPermissions, ...boardRest } = board;

    return {
        ...boardRest,
        columns,
        tasks: tasksMap,
        boardUsers: boardUser.map((bu) => ({
            id: bu.id,
            role: bu.role,
            user: bu.user,
        })),
        membersPermissions: memberPermissions?.map((p) => p.permission),
    };
};

const idSchema = z.object({ id: z.string().cuid() });

export const getBoardById = authedRateLimitedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
        try {
            const userId = ctx.session.user.id;

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
                    boardUser: {
                        select: {
                            id: true,
                            role: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!board) throw notFound('Board not found');

            const me = board.boardUser.find((u) => u.user.id === userId);
            if (!me) throw forbidden('You are not a member of this board.');

            // VIEWERs dont need to know anything about members permissions.
            // On the other hand, ADMINs should know because they can change them
            // and MEMBERs should know so their actions can be restricted based on their permissions
            if (me.role !== 'VIEWER') {
                const memberPermissions =
                    await ctx.prisma.memberPermission.findUnique({
                        where: { boardId: board.id },
                        include: { permissions: true },
                    });

                return normalizeBoardData({
                    ...board,
                    memberPermissions: memberPermissions?.permissions,
                });
            }

            return normalizeBoardData(board);
        } catch (error) {
            const message = queryError('board', true);
            throw internalServerError(message, error);
        }
    });
