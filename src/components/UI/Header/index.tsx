import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { CgMenuRightAlt } from 'react-icons/cg';

const Header = ({ withDrawerBtn = false }: { withDrawerBtn?: boolean }) => {
    return (
        <>
            <header className="navbar border-b border-b-base-100 bg-base-200">
                <div className="flex-none">
                    {withDrawerBtn && (
                        <label
                            htmlFor="my-drawer-2"
                            className="btn btn-ghost drawer-button lg:hidden"
                        >
                            <CgMenuRightAlt size={22} />
                        </label>
                    )}
                </div>
                <div className="flex-1 px-3">
                    <a className="text-2xl font-bold normal-case">OpenKBan</a>
                </div>
            </header>
        </>
    );
};

export default Header;
