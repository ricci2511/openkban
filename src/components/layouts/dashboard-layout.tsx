import React, { PropsWithChildren, useState } from 'react';
import MainLayout from './main-layout';
import CreateBoardModal from '@components/dashboard/create-board-modal';

const DashboardLayout = ({ children }: PropsWithChildren) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen((open) => !open);

    return (
        <>
            <MainLayout>
                {children}
                <button className="btn-primary btn" onClick={toggleModal}>
                    Add Board
                </button>
            </MainLayout>
            <CreateBoardModal isOpen={isModalOpen} toggleModal={toggleModal} />
        </>
    );
};

export default DashboardLayout;
