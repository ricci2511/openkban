import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuLabel,
} from './ui/dropdown-menu';
import { RxChevronUp, RxExit } from 'react-icons/rx';

export const SidebarUser = ({ session }: { session: Session }) => {
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
                    <DropdownMenu>
                        <DropdownMenuTrigger className="px-1 pb-2">
                            <RxChevronUp className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            align="end"
                            sideOffset={10}
                        >
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="focus:bg-red-400 dark:focus:bg-red-600"
                                onClick={() =>
                                    signOut({ callbackUrl: '/auth/signin' })
                                }
                                aria-label="Sign out of your account"
                            >
                                <RxExit className="mr-2 h-4 w-4" />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </article>
    );
};
