import { trpc } from '@lib/trpc';
import {
    useBoardTasks,
    useColumns,
    useInitColumnsTasksStore,
} from 'store/columns-tasks-store';

/**
 * @param boardId
 * @returns column tasks trpc query object without the data property, instead it returns columns and tasks from the store when available
 */
const useFetchColumnTasks = (boardId: string) => {
    const columns = useColumns(boardId);
    const tasks = useBoardTasks(boardId);
    const initColumnTasksStore = useInitColumnsTasksStore();

    /**
     * fetch columns with its related tasks in one query if the data is not in the store
     * will not run if useFetchBoardData already fetched all the required data
     */
    const columnsTasksQuery = trpc.boardColumnRouter.getAllByBoardId.useQuery(
        { boardId },
        {
            enabled: !columns,
            onSuccess: (columns) => {
                if (!columns) return;
                initColumnTasksStore(columns);
            },
        }
    );
    // workaround for isLoading when the query is disabled
    const isQueryLoading =
        columnsTasksQuery.isInitialLoading || columnsTasksQuery.isRefetching;
    const { data, isLoading, ...queryProps } = columnsTasksQuery;

    if (columns && tasks) {
        return { ...queryProps, columns, tasks, isLoading: isQueryLoading };
    } else {
        return {
            ...queryProps,
            columns: null,
            tasks: null,
            isLoading: isQueryLoading,
        };
    }
};

export default useFetchColumnTasks;
