import React from 'react';
import dynamic from 'next/dynamic';

const BoardUsersDialog = dynamic(
    () =>
        import('./board-users/board-users-dialog').then(
            (mod) => mod.BoardUsersDialog
        ),
    { ssr: false }
);
const CreateTaskDialog = dynamic(
    () =>
        import('./task-creation/create-task-dialog').then(
            (mod) => mod.CreateTaskDialog
        ),
    { ssr: false }
);

export const KanbanHeaderSection = ({ title }: { title: string }) => {
    return (
        <section className="flex h-auto w-full flex-wrap items-center justify-between gap-3 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-x-5">
                <h1 className="text-2xl font-semibold uppercase">{title}</h1>
                <CreateTaskDialog />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <BoardUsersDialog />
            </div>
        </section>
    );
};
