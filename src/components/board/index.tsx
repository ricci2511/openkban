import DotsDropdownButton from '@components/UI/buttons/dots-dropdown-button';
import { trpc } from '@lib/trpc';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface BoardProps {
    board: Board;
}

const BoardItem = ({ board }: BoardProps) => {
    const utils = trpc.useContext();

    // get cached boards data
    const boards = utils.boardRouter.getAll.getData();
    const { mutate: deleteBoard } = trpc.boardRouter.delete.useMutation({
        onSuccess: (data) => {
            const newBoards = [...(boards || [])].filter(
                (board) => board.id !== data.id
            );
            utils.boardRouter.getAll.setData(newBoards);
        },
    });
    const { mutate: updateBoard } = trpc.boardRouter.update.useMutation({
        onSuccess: (data) => {
            const boardToUpdate = boards?.findIndex(
                (board) => board.id === data.id
            );
            if (boardToUpdate) {
                const newBoards = [...(boards || [])];
                newBoards.splice(boardToUpdate, 1, data);
                utils.boardRouter.getAll.setData(newBoards);
            }
        },
    });

    const { title, id } = board;
    // client state
    const [editTitle, setEditTitle] = useState(title);
    const [editMode, setEditMode] = useState(false);

    const handleEditMode = () => setEditMode((prevState) => !prevState);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEditMode();
            if (editTitle === title) return;
            updateBoard({ title: editTitle, id: id });
        }
    };

    return (
        <li
            key={id}
            className="flex h-20 items-center justify-between gap-2 rounded-sm bg-base-300 py-3 pl-3 pr-1"
        >
            {editMode ? (
                <input
                    type="text"
                    className="input w-full max-w-xs"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.currentTarget.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onBlur={handleEditMode}
                    autoFocus
                />
            ) : (
                <p className="text-base">{title}</p>
            )}
            <DotsDropdownButton>
                <li>
                    <button
                        className="btn-outline btn-md font-medium"
                        onClick={handleEditMode}
                    >
                        <HiPencil size={18} />
                        Edit
                    </button>
                </li>
                <li>
                    <button
                        className="btn-outline btn-error btn-md font-medium"
                        onClick={() => deleteBoard({ id: id })}
                    >
                        <HiTrash size={18} />
                        Delete
                    </button>
                </li>
            </DotsDropdownButton>
        </li>
    );
};

export default BoardItem;
