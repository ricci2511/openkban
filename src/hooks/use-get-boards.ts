import { SortableBoard } from '@lib/schemas/board-schemas';
import { trpc } from '@lib/trpc';
import { Board } from '@prisma/client';
import { useEffect } from 'react';
import useBoardStore from 'store/board-store';

/**
 * @param sortBy object with prop and order enums to sort the boards by
 * @returns sorted boards, isLoading state, error state
 */
const useGetBoards = (sortBy?: SortableBoard) => {
    const storeBoards = useBoardStore((state) => state.boards);
    const { data, isLoading, error } = trpc.boardRouter.getAll.useQuery(
        undefined,
        {
            // If there are boards in the store, don't fetch them again
            enabled: !storeBoards.length,
        }
    );

    const setBoards = useBoardStore((state) => state.setBoards);
    useEffect(() => {
        // only set the boards if it is empty, on initial dashboard page load
        if (!storeBoards.length && data) setBoards(data);
    }, [data, setBoards, storeBoards]);

    const getSortedBoards = ([...boards]: Board[], sort: SortableBoard) => {
        const { prop, order } = sort;
        switch (prop) {
            case 'lastInteractedAt':
                return boards.sort((a, b) =>
                    order === 'desc'
                        ? Number(b.lastInteractedAt) -
                          Number(a.lastInteractedAt)
                        : Number(a.lastInteractedAt) -
                          Number(b.lastInteractedAt)
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

    const boards = sortBy ? getSortedBoards(storeBoards, sortBy) : storeBoards;
    return { boards, isLoading, error };
};

export default useGetBoards;
