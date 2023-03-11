import { BoardTask } from '@prisma/client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Tasks = {
    [columnId: string]: BoardTask[];
};

type ColumnStore = {
    tasks: Tasks;
    setTasks: (tasks: Tasks) => void;
    addTask: (task: BoardTask) => void;
    removeTask: (taskId: string, columnId: string) => void;
    updateTask: (task: BoardTask) => void;
    getTaskById: (id: string) => BoardTask | undefined;
};

const useTaskStore = create(
    immer<ColumnStore>((set, get) => ({
        tasks: {},
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
                const index = state.tasks[task.columnId].findIndex(
                    (t) => t.id === task.id
                );
                if (index !== -1) {
                    state.tasks[task.columnId][index] = task;
                }
            }),
        getTaskById: (id: string) => {
            const tasks = Object.values(get().tasks).flat();
            return tasks.find((t) => t.id === id);
        },
    }))
);

export default useTaskStore;
