import React from 'react';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';

const DropdownTopButton = ({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) => {
    return (
        <div className="dropdown-end dropdown-top dropdown">
            <label tabIndex={0} className="btn btn-outline btn-circle btn-xs">
                <MdOutlineKeyboardArrowUp size={16} />
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box mb-3 w-52 bg-base-100 p-2 shadow"
            >
                {children}
            </ul>
        </div>
    );
};

export default DropdownTopButton;
