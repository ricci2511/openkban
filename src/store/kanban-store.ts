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
        currentTask: undefined,
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
            setCurrentTask: (task) =>
                set((state) => {
                    state.currentTask = task;
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
                    // update current task if it's the same as the updated task
                    if (state.currentTask && state.currentTask.id === task.id) {
                        state.currentTask = task;
                    }

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
            setBoardUsers: (users) =>
                set((state) => {
                    state.boardUsers = users;
                }),
            addBoardUsers: (users) =>
                set((state) => {
                    state.boardUsers = [...state.boardUsers, ...users];
                }),
            removeBoardUser: (boardUserId) =>
                set((state) => {
                    state.boardUsers = state.boardUsers.filter(
                        (bu) => bu.id !== boardUserId
                    );
                }),
            updateBoardUser: (user) =>
                set((state) => {
                    const index = state.boardUsers.findIndex(
                        (bu) => bu.user.id === user.user.id
                    );
                    if (index === -1) return;
                    state.boardUsers[index] = user;
                }),
        },
    }))
);

/**
 * @returns method to initialize the kanban store with the given columns and tasks
 */
export const useInitKanbanStore = () => useKanbanStore((state) => state.init);

/**
 * @returns boardId of the current kanban board
 */
export const useBoardId = () => useKanbanStore((state) => state.boardId);

/**
 * @returns all columns that are in the kanban store
 */
export const useColumns = () => useKanbanStore((state) => state.columns);

/**
 * @returns all tasks that are in the kanban store
 */
export const useTasks = () => useKanbanStore((state) => state.tasks);

/**
 * @returns the current task that the user is working on
 */
export const useCurrentTask = () =>
    useKanbanStore((state) => state.currentTask);

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
