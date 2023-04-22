import { signOut, useSession } from 'next-auth/react';
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
import { SidebarProps } from './sidebar';
import { Button } from './ui/button';
import { ChevronUp, LogOut } from 'lucide-react';
import { cn } from '@lib/helpers';

export const SidebarUser = ({ collapsed, setCollapsed }: SidebarProps) => {
    const { data: session } = useSession();
    const { email, image, name } = session!.user!;

    return (
        <div className="grid place-content-stretch p-2">
            <div className="flex h-20 items-center gap-3 overflow-hidden">
                <Image
                    src={image ?? ''}
                    alt={name ?? email ?? 'Unknown'}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div
                    className={cn(
                        'opacity-0 transition-opacity duration-75',
                        !collapsed && 'opacity-100 duration-200 delay-150' // delay this section to make it smoother
                    )}
                >
                    <div className="flex w-full">
                        <div className="max-w-[12rem]">
                            <p className="text-base font-bold">{name}</p>
                            <p
                                className="truncate text-sm text-slate-500"
                                title={email ?? ''}
                            >
                                {email}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    className="self-start"
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="end"
                                sideOffset={10}
                            >
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        signOut({
                                            callbackUrl: '/auth/signin',
                                        })
                                    }
                                    aria-label="Sign out of your account"
                                    destructive
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};
