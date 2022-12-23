import NextError from 'next/error';
import { trpc } from '@lib/trpc';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import MainLayout from '@components/layouts/main-layout';
import { NextPageWithLayout } from 'pages/_app';
import useUpdateBoard from '@hooks/use-update-board';

export const Board: NextPageWithLayout = () => {
    const id = useRouter().query.bid as string;
    const { data, error, status } = trpc.boardRouter.getById.useQuery({ id });
    const { updateBoard } = useUpdateBoard();

    // Update the board's lastInteractedAt field
    useEffect(() => {
        if (id) {
            updateBoard({ id, lastInteractedAt: new Date() });
        }
    }, [id, updateBoard]);

    if (error) {
        return (
            <NextError
                title={error.message}
                statusCode={error.data?.httpStatus ?? 500}
            />
        );
    }

    if (status !== 'success') {
        return <>Loading...</>;
    }

    return <div>{data?.title}</div>;
};

Board.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
};

export default Board;
