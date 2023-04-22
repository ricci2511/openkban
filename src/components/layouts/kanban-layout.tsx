import { PropsWithChildren } from 'react';
import { MainLayout } from './main-layout';

export const KanbanLayout = ({ children }: PropsWithChildren) => {
    return (
        <MainLayout>
            <div className="absolute inset-0 overflow-hidden">
                <div className="relative mr-0 flex h-full flex-col">
                    {children}
                </div>
            </div>
        </MainLayout>
    );
};
