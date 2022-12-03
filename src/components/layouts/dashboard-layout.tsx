import React, { PropsWithChildren } from 'react';
import MainLayout from './main-layout';
import CreateBoardModal from '@components/dashboard/create-board-modal';

const DashboardLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <MainLayout>{children}</MainLayout>
            <CreateBoardModal />
        </>
    );
};

export default DashboardLayout;
