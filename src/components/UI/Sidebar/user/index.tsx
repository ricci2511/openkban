import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import DropdownTopButton from '@components/UI/buttons/dropdown-top-button';
import { RiSettings3Fill, RiUserSettingsFill } from 'react-icons/ri';

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
        <article className="my-2 border-t border-t-base-100">
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
                <div>
                    <p className="text-md font-bold">{name}</p>
                    <small className="text-slate-500">{email}</small>
                </div>
                <div>
                    <DropdownTopButton>
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
                                className="btn btn-outline btn-error"
                                onClick={() =>
                                    signOut({ callbackUrl: '/auth/signin' })
                                }
                            >
                                Sign out
                            </button>
                        </li>
                    </DropdownTopButton>
                </div>
            </div>
        </article>
    );
};

export default User;
