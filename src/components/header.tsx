import React from 'react';
import { CgMenuRightAlt } from 'react-icons/cg';
import { ThemeSwitchButton } from './theme-switch-button';

export const Header = () => {
    return (
        <header className="navbar border-b border-b-base-100 bg-base-200">
            <div className="flex-none lg:hidden">
                <label
                    htmlFor="my-drawer-2"
                    className="drawer-button btn-ghost btn lg:hidden"
                    aria-label="open sidebar menu"
                >
                    <CgMenuRightAlt size={22} />
                </label>
            </div>
            <div className="flex-1 px-3">
                <a className="text-2xl font-bold normal-case">OpenKBan</a>
            </div>
            <div className="flex-none px-3">
                <ThemeSwitchButton />
            </div>
        </header>
    );
};
