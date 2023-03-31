import { PRESET_COLORS } from '@lib/constants';
import { randomNoRepeats } from '@lib/helpers';
import { boardCeationSchema } from '@lib/schemas/board-schemas';
import { internalServerError } from '@server/helpers/error-helpers';
import { saveBoard } from '@server/redis/board';
import { authedProcedure } from '@server/routers/auth-router';
import {
    BOARD_CREATE_ERROR,
    BOARD_IDS_CACHE_ERROR,
    BOARD_METADATA_CACHE_ERROR,
} from '../errors';
import { addBoardIdOrIds } from '@server/redis/user-board-ids';

export const createBoard = authedProcedure
    .input(boardCeationSchema)
    .mutation(async ({ ctx, input }) => {
        const randomColor = randomNoRepeats(PRESET_COLORS);
        const userId = ctx.session.user.id;
        try {
            const board = await ctx.prisma.board.create({
                data: {
                    title: input.title,
                    isFavourite: input.isFavourite,
                    userId: ctx.session.user.id,
                    columns: {
                        create: input.columnTitles.map((title) => ({
                            title: title,
                            color: randomColor(),
                        })),
                    },
                },
            });

            // cache the new board metadata
            await saveBoard(board).catch((error) => {
                throw internalServerError(BOARD_METADATA_CACHE_ERROR, error);
            });
            // cache the new board ID
            await addBoardIdOrIds(userId, board.id).catch((error) => {
                throw internalServerError(BOARD_IDS_CACHE_ERROR, error);
            });

            return board;
        } catch (error) {
            throw internalServerError(BOARD_CREATE_ERROR, error);
        }
    });
