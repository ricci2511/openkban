import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { RiSettings3Fill, RiUserSettingsFill } from 'react-icons/ri';
import DropdownButton from '@components/ui/buttons/dropdown-button';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';

const User = ({ session }: { session: Session }) => {
    if (!session.user) {
        return (
            <article className="my-2 flex flex-col items-center gap-2 border-t border-t-base-100">
                <p className="pt-2 font-semibold">Oops, user not found...</p>
            </article>
        );
    }

    const { email, image, name } = session.user;
    return (
        <article className="my-2 mx-auto border-t border-t-base-100">
            <div className="flex gap-2 pt-3">
                {image && (
                    <div className="avatar">
                        <div className="w-12 rounded-full">
                            <Image
                                src={image}
                                alt={name ? name : 'Unknown'}
                                width={48}
                                height={48}
                            />
                        </div>
                    </div>
                )}
                <div className="max-w-[12rem]">
                    <p className="text-md font-bold">{name}</p>
                    <p
                        className="truncate text-sm text-slate-500"
                        title={email ?? ''}
                    >
                        {email}
                    </p>
                </div>
                <div>
                    <DropdownButton
                        position="topEnd"
                        labelIcon={<MdOutlineKeyboardArrowUp size={16} />}
                        labelClassName="btn btn-outline btn-circle btn-xs btn-active"
                        contentClassName="rounded-box mb-3 w-52 bg-base-100 p-2 shadow"
                    >
                        <li>
                            <a>
                                <RiUserSettingsFill size={18} />
                                Account settings
                            </a>
                        </li>
                        <li>
                            <a>
                                <RiSettings3Fill size={18} />
                                App settings
                            </a>
                        </li>
                        <li className="mt-3">
                            <button
                                className="btn-outline btn-error btn"
                                onClick={() =>
                                    signOut({ callbackUrl: '/auth/signin' })
                                }
                            >
                                Sign out
                            </button>
                        </li>
                    </DropdownButton>
                </div>
            </div>
        </article>
    );
};

export default User;
