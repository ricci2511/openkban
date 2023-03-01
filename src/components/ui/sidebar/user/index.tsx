import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { RiSettings3Fill, RiUserSettingsFill } from 'react-icons/ri';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { Button, Dropdown } from 'react-daisyui';

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
                    <div className="avatar m-auto inline-block">
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
                    <Dropdown vertical="top" className="dropdown-end">
                        <Button
                            variant="outline"
                            color="ghost"
                            size="xs"
                            shape="circle"
                        >
                            <MdOutlineKeyboardArrowUp size={16} />
                        </Button>
                        <Dropdown.Menu className="mb-2 w-52 gap-2 bg-base-100">
                            <Dropdown.Item>
                                <RiUserSettingsFill size={18} />
                                Account settings
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <RiSettings3Fill size={18} />
                                App settings
                            </Dropdown.Item>
                            <li className="mt-1">
                                <Button
                                    variant="outline"
                                    color="error"
                                    aria-label="Sign out of your account"
                                    onClick={() =>
                                        signOut({ callbackUrl: '/auth/signin' })
                                    }
                                >
                                    Sign out
                                </Button>
                            </li>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </article>
    );
};

export default User;
