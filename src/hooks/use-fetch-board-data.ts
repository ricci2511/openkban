import { trpc } from '@lib/trpc';
import { useBoardActions, useBoardById } from 'store/board-store';
import { useInitColumnsTasksStore } from 'store/columns-tasks-store';

/**
 * @returns board trpc query object but with the board data from the store
 */
const useFetchBoardData = (boardId: string) => {
    const board = useBoardById(boardId);
    const { addBoard } = useBoardActions();
    const initColumnTasksStore = useInitColumnsTasksStore();

    /**
     * fetch board with its related columns and tasks in one query if the data is not in the store
     * will only run if the board is not in the store e.g. when the user navigates to the board directly by url
     */
    const boardByIdQuery = trpc.boardRouter.getById.useQuery(
        { id: boardId },
        {
            enabled: !board,
            onSuccess: (board) => {
                if (!board) return;
                addBoard(board);
                initColumnTasksStore(board.columns);
            },
        }
    );

    // workaround for isLoading when the query is disabled
    const isBoardLoading =
        boardByIdQuery.isInitialLoading || boardByIdQuery.isRefetching;
    const { data, isLoading, ...boardQuery } = boardByIdQuery;

    return { ...boardQuery, data: board, isLoading: isBoardLoading };
};

export default useFetchBoardData;
