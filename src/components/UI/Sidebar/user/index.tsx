import { trpc } from '@lib/trpc';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { BarsScaleFade } from 'react-svg-spinners';

const User = () => {
    const { data, isLoading, refetch } = trpc.useQuery(['auth.getSession']);

    if (!isLoading && !data) {
        return (
            <article className="my-2 flex flex-col items-center gap-2 border-t border-t-base-100">
                <p className="pt-2 font-semibold">User not found...</p>
                <button className="btn btn-sm" onClick={() => refetch()}>
                    Try again?
                </button>
            </article>
        );
    }

    if (isLoading)
        return (
            <div className="mx-auto flex items-center justify-center">
                <BarsScaleFade />
            </div>
        );

    const { email, image, name } = data.user;
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
                <button className="btn btn-outline btn-circle btn-xs">
                    <MdOutlineKeyboardArrowUp size={16} />
                </button>
            </div>
        </article>
    );
};

export default User;
