import { arrayMove } from '@dnd-kit/sortable';
import { ALL_BOARD_PERMISSIONS } from '@lib/constants';
import { Permission } from '@prisma/client';
import { PermissionMap } from 'types/board-types';
import { KanbanStore } from 'types/kanban-store-types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const getPermissionMap = (currPermissions: Permission[] | undefined) => {
    // when no permissions are passed, the user is likely a VIEWER, so we can keep it undefined
    if (!currPermissions) return;

    return ALL_BOARD_PERMISSIONS.reduce<PermissionMap>((acc, perm) => {
        acc[perm] = currPermissions?.includes(perm) || false;
        return acc;
    }, {} as PermissionMap);
};

const useKanbanStore = create(
    immer<KanbanStore>((set) => ({
        boardId: '',
        columns: [],
        tasks: {},
        currTaskRef: undefined,
        subtasks: [],
        boardUsers: [],
        role: 'VIEWER',
        membersPermissions: undefined,
        init: (boardData, currRole) =>
            set((state) => {
                state.columns = boardData.columns;
                state.tasks = boardData.tasks;
                state.boardUsers = boardData.boardUsers;
                state.role = currRole;
                state.membersPermissions = getPermissionMap(
                    boardData.membersPermissions
                );
                state.boardId = boardData.id;
            }),
        setRole: (role) =>
            set((state) => {
                state.role = role;
            }),
        updateMembersPermission: (permission, access) =>
            set((state) => {
                if (!state.membersPermissions) return;
                state.membersPermissions[permission] = access;
            }),
        setCurrTaskRef: (columnId, taskId) =>
            set((state) => {
                const taskIndex = state.tasks[columnId].findIndex(
                    (t) => t.id === taskId
                );
                state.currTaskRef = [columnId, taskIndex];
            }),
        columnsActions: {
            setColumns: (columns) =>
                set((state) => {
                    state.columns = columns;
                }),
            addColumn: (column) =>
                set((state) => {
                    state.columns.push(column);
                    state.tasks[column.id] = [];
                }),
            deleteColumn: (columnId) =>
                set((state) => {
                    state.columns = state.columns.filter(
                        (col) => col.id !== columnId
                    );
                    delete state.tasks[columnId];
                }),
            updateColumn: (column) =>
                set((state) => {
                    const index = state.columns.findIndex(
                        (col) => col.id === column.id
                    );
                    if (index === -1) return;
                    state.columns[index] = column;
                }),
        },
        tasksActions: {
            setTasks: (tasks) =>
                set((state) => {
                    state.tasks = tasks;
                }),
            addTask: (task) =>
                set((state) => {
                    if (!state.tasks[task.columnId]) {
                        state.tasks[task.columnId] = [];
                    }
                    state.tasks[task.columnId].push(task);
                }),
            removeTask: (taskId, columnId) =>
                set((state) => {
                    state.tasks[columnId] = state.tasks[columnId].filter(
                        (task) => task.id !== taskId
                    );
                }),
            updateTask: (task) =>
                set((state) => {
                    if (!state.tasks[task.columnId]) return;
                    const index = state.tasks[task.columnId].findIndex(
                        (t) => t.id === task.id
                    );
                    if (index === -1) return;
                    state.tasks[task.columnId][index] = task;
                }),
            dropTaskInColumn: (columnId, tasks, oldTaskIndex, newTaskIndex) =>
                set((state) => {
                    state.tasks[columnId] = arrayMove(
                        tasks,
                        oldTaskIndex,
                        newTaskIndex
                    );
                }),
        },
        subtasksActions: {
            setSubtasks: (subtasks) =>
                set((state) => {
                    state.subtasks = subtasks;
                }),
            addSubtask: (subtask) =>
                set((state) => {
                    !state.subtasks
                        ? (state.subtasks = [subtask])
                        : state.subtasks.push(subtask);
                }),
            removeSubtask: (subtaskId) =>
                set((state) => {
                    state.subtasks = state.subtasks.filter(
                        (st) => st.id !== subtaskId
                    );
                }),
            updateSubtask: (subtask) =>
                set((state) => {
                    const index = state.subtasks.findIndex(
                        (st) => st.id === subtask.id
                    );
                    if (index === -1) return;
                    state.subtasks[index] = subtask;
                }),
        },
        boardUserActions: {
            setBoardUsers: (boardUsers) =>
                set((state) => {
                    state.boardUsers = boardUsers;
                }),
            addBoardUsers: (boardUsers) =>
                set((state) => {
                    state.boardUsers = [...state.boardUsers, ...boardUsers];
                }),
            removeBoardUser: (boardUserId) =>
                set((state) => {
                    state.boardUsers = state.boardUsers.filter(
                        (bu) => bu.id !== boardUserId
                    );
                }),
            updateBoardUser: (boardUser) =>
                set((state) => {
                    const index = state.boardUsers.findIndex(
                        (bu) => bu.id === boardUser.id
                    );
                    if (index === -1) return;
                    const userToUpdate = state.boardUsers[index];
                    state.boardUsers[index] = { ...userToUpdate, ...boardUser };
                }),
        },
    }))
);

/**
 * Initializes the kanban store to interact with the kanban board data
 * @param boardData data of the board to initialize the store with
 * @param currRole role of the current user
 */
export const initKanbanStore = useKanbanStore.getState().init;

/**
 * @returns boardId of the current kanban board
 */
export const getBoardId = () => useKanbanStore.getState().boardId;

/**
 * @returns all columns that are in the kanban store
 */
export const useColumns = () => useKanbanStore((state) => state.columns);

/**
 * @returns all tasks that are in the kanban store
 */
export const useTasks = () => useKanbanStore((state) => state.tasks);

/**
 * @returns the currently opened task or undefined if no task is opened
 */
export const useCurrentTask = () => {
    // get the reference to the task in the tasks map
    const taskRef = useKanbanStore((state) => state.currTaskRef);
    if (!taskRef) return undefined;
    const [columnId, taskIndex] = taskRef;
    return useKanbanStore.getState().tasks[columnId][taskIndex];
};

/**
 * @returns method to set the reference to the currently opened task in the kanban store
 */
export const useSetCurrTaskRef = () =>
    useKanbanStore((state) => state.setCurrTaskRef);

/**
 * @returns all subtasks that are in the kanban store
 */
export const useSubtasks = () => useKanbanStore((state) => state.subtasks);

/**
 * @returns all board users of the current board
 */
export const useBoardUsers = () => useKanbanStore((state) => state.boardUsers);

/**
 * @returns the role of the current user
 */
export const useMyRole = () => useKanbanStore((state) => state.role);

/**
 * @returns method to set/update the role of the current user
 */
export const useSetMyRole = () => useKanbanStore((state) => state.setRole);

/**
 * @returns the permissions of board users with the MEMBER role
 */
export const useMembersPermissions = () =>
    useKanbanStore((state) => state.membersPermissions);

export const useUpdateMembersPermission = () =>
    useKanbanStore((state) => state.updateMembersPermission);

/**
 * All actions can be accessed with one selector while avoiding unnecessary rerenders.
 * @see: https://tkdodo.eu/blog/working-with-zustand#separate-actions-from-state
 * @returns object with all actions that can be performed on the columns
 */
export const useColumnsActions = () =>
    useKanbanStore((state) => state.columnsActions);

/**
 * @returns object with all actions that can be performed on the tasks
 */
export const useTasksActions = () =>
    useKanbanStore((state) => state.tasksActions);

/**
 * @returns object with all actions that can be performed on the subtasks
 */
export const useSubtasksActions = () =>
    useKanbanStore((state) => state.subtasksActions);

/**
 * @returns object with all actions that can be performed on the board users
 */
export const useBoardUserActions = () =>
    useKanbanStore((state) => state.boardUserActions);
