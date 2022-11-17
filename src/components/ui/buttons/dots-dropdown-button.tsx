import React, { ReactFragment } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

const DotsDropdownButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="dropdown-end dropdown outline-1 outline-base-200">
            <button tabIndex={0}>
                <HiOutlineDotsVertical size={19} />
            </button>
            <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box mt-5 w-36 gap-2 bg-base-200 p-2 shadow"
            >
                {children}
            </ul>
        </div>
    );
};

export default DotsDropdownButton;
