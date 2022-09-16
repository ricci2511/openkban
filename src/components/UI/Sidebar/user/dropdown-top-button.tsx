import React from 'react';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { signOut } from 'next-auth/react';

const DropdownTopButton = () => {
    return (
        <div className="dropdown-top dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-circle btn-xs">
                <MdOutlineKeyboardArrowUp size={16} />
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box mb-3 w-52 bg-base-100 p-2 shadow"
            >
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
                <li>
                    <button
                        className="btn btn-outline btn-error mt-2"
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    >
                        Sign out
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default DropdownTopButton;
