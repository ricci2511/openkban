import React from 'react';
import CreateTaskModalButton from './create-task-modal-button';

const KanbanHeaderSection = ({ title }: { title: string }) => {
    return (
        <section className="fixed flex w-full items-center gap-x-6 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold uppercase">{title}</h1>
            <CreateTaskModalButton />
        </section>
    );
};

export default KanbanHeaderSection;
