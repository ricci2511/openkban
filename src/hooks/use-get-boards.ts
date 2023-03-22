import { SortableBoard } from '@lib/schemas/board-schemas';
import { trpc } from '@lib/trpc';
import { Board } from '@prisma/client';

const getSortedBoards = ([...boards]: Board[], sort: SortableBoard) => {
    const { prop, order } = sort;
    switch (prop) {
        case 'lastInteractedAt':
            return boards.sort((a, b) =>
                order === 'desc'
                    ? Number(b.lastInteractedAt) - Number(a.lastInteractedAt)
                    : Number(a.lastInteractedAt) - Number(b.lastInteractedAt)
            );
        case 'title':
            return boards.sort((a, b) =>
                order === 'desc'
                    ? b.title.localeCompare(a.title)
                    : a.title.localeCompare(b.title)
            );
        case 'createdAt':
            return boards.sort((a, b) =>
                order === 'desc'
                    ? Number(b.createdAt) - Number(a.createdAt)
                    : Number(a.createdAt) - Number(b.createdAt)
            );
        default:
            return boards;
    }
};

/**
 * @param sortBy object with prop and order enums to sort the boards by
 * @returns sorted boards, isLoading state, error state
 */
const useGetBoards = (sortBy?: SortableBoard) => {
    const cachedQuery = trpc.useContext().boardRouter.getAll.getData();
    const { data, isLoading, error } = trpc.boardRouter.getAll.useQuery(
        undefined,
        {
            enabled: !cachedQuery,
            initialData: cachedQuery,
        }
    );

    const boards = sortBy && data ? getSortedBoards(data, sortBy) : data;
    return { boards, isLoading, error };
};

export default useGetBoards;
