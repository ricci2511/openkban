import { trpc } from '@lib/trpc';
import { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react';
import DropdownTopButton from './dropdown-top-button';

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
            <div className="-ml-2 flex gap-2 pt-3">
                {image && (
                    <div className="avatar">
                        <div className=" w-14 rounded-full">
                            <Image
                                src={image}
                                alt={name ? name : 'Unknown'}
                                width={56}
                                height={56}
                            />
                        </div>
                    </div>
                )}
                <div>
                    <p className="text-lg font-bold">{name}</p>
                    <small className="text-slate-500">{email}</small>
                </div>
                <DropdownTopButton />
            </div>
        </article>
    );
};

export default User;
