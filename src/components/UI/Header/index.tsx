import React from 'react';
import { CgMenuRightAlt } from 'react-icons/cg';
import ThemeSwitchButton from '@components/ui/buttons/theme-switch-button';

const Header = ({ withDrawerBtn = false }: { withDrawerBtn?: boolean }) => {
    return (
        <>
            <header className="navbar border-b border-b-base-100 bg-base-200">
                {withDrawerBtn && (
                    <div className="flex-none">
                        <label
                            htmlFor="my-drawer-2"
                            className="btn-ghost drawer-button btn lg:hidden"
                            aria-label="open sidebar menu"
                        >
                            <CgMenuRightAlt size={22} />
                        </label>
                    </div>
                )}
                <div className="flex-1 px-3">
                    <a className="text-2xl font-bold normal-case">OpenKBan</a>
                </div>
                <div className="flex-none px-3">
                    <ThemeSwitchButton />
                </div>
            </header>
        </>
    );
};

export default Header;
