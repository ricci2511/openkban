import { SortableBoard } from '@lib/schemas/board-schemas';
import { trpc } from '@lib/trpc';
import { BoardWithUsers } from 'types/board-types';

const getSortedBoards = (
    [...boards]: BoardWithUsers[],
    sort: SortableBoard
) => {
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
 * @param sortBy optional object with prop and order enums to sort the boards by
 * @param enabled whether to query the boards or not, defaults to true
 * @returns sorted boards and query state
 */
const useGetBoards = (sortBy?: SortableBoard, enabled: boolean = true) => {
    // TODO: change useQuery to useInfiniteQuery
    const isCached = !!trpc.useContext().boardRouter.getAll.getData();
    const boardsQuery = trpc.boardRouter.getAll.useQuery(undefined, {
        refetchOnWindowFocus: false,
        enabled: enabled && !isCached,
    });

    const { data, ...rest } = boardsQuery;
    const boards = sortBy && data ? getSortedBoards(data, sortBy) : data;

    return { boards, ...rest };
};

export default useGetBoards;
