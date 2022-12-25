import { trpc } from '@lib/trpc';
import { Board } from '@prisma/client';
import { z } from 'zod';

const sortableBoard = z.object({
    prop: z.enum(['createdAt', 'title', 'lastInteractedAt']),
    desc: z.boolean().default(false).optional(),
});
type SortableBoardType = z.infer<typeof sortableBoard>;

const useGetBoards = (sortBy?: SortableBoardType) => {
    const { data, isLoading, error } = trpc.boardRouter.getAll.useQuery();

    // I decided to sort on the client instead of the server to avoid too many server calls (just in case)
    // If I would make a big bag with this project and be able to pay for servers, I would maybe move this action to the server
    const getSortedBoards = (
        boards: Board[] | undefined,
        sort: SortableBoardType
    ) => {
        if (!boards) return;
        const { prop, desc } = sort;
        switch (prop) {
            case 'lastInteractedAt':
                if (desc) {
                    return boards.sort(
                        (a, b) =>
                            Number(b.lastInteractedAt) -
                            Number(a.lastInteractedAt)
                    );
                }
                return boards.sort(
                    (a, b) =>
                        Number(a.lastInteractedAt) - Number(b.lastInteractedAt)
                );
            case 'title':
                if (desc) {
                    return boards.sort((a, b) =>
                        b.title.localeCompare(a.title)
                    );
                }
                return boards.sort((a, b) => a.title.localeCompare(b.title));
            case 'createdAt':
                if (desc) {
                    return boards.sort(
                        (a, b) => Number(b.createdAt) - Number(a.createdAt)
                    );
                }
                return boards.sort(
                    (a, b) => Number(a.createdAt) - Number(b.createdAt)
                );
            default:
                return boards;
        }
    };

    const boards = sortBy ? getSortedBoards(data, sortBy) : data;
    return { boards, isLoading, error };
};

export default useGetBoards;
