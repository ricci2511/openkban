import { Permission } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useMembersPermissions } from 'store/kanban-store';
import { ALL_BOARD_PERMISSIONS } from '@lib/constants';
import { MembersAccessColumns } from './members-access-columns';
import { MembersAccessTasks } from './members-access-tasks';
import { MembersAccessSubtasks } from './members-access-subtasks';
import { Separator } from '@components/ui/separator';

export type PermissionMap = Record<Permission, boolean>;

export interface MembersAccessProps {
    currPermissions: PermissionMap;
    onPermissionChange: (perm: Permission, value: boolean) => void;
}

export const getPermissionMap = (currPermissions: Permission[] | undefined) => {
    return ALL_BOARD_PERMISSIONS.reduce<PermissionMap>((acc, perm) => {
        acc[perm] = currPermissions?.includes(perm) || false;
        return acc;
    }, {} as PermissionMap);
};

export const MembersAccessSection = () => {
    const memberPermissions = useMembersPermissions();
    const [currPermissions, setCurrPermissions] = useState<PermissionMap>();

    useEffect(() => {
        setCurrPermissions(getPermissionMap(memberPermissions));
    }, [memberPermissions]);

    const onPermissionChange = (perm: Permission, value: boolean) => {
        setCurrPermissions((curr) => {
            if (!curr) return curr;

            return {
                ...curr,
                [perm]: value,
            };
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {currPermissions && (
                <>
                    <section className="h-full w-full">
                        <h2 className="mb-2 font-semibold">
                            Columns permissions
                        </h2>
                        <MembersAccessColumns
                            currPermissions={currPermissions}
                            onPermissionChange={onPermissionChange}
                        />
                    </section>
                    <Separator />
                    <section className="h-full w-full">
                        <h2 className="mb-2 font-semibold">
                            Tasks permissions
                        </h2>
                        <MembersAccessTasks
                            currPermissions={currPermissions}
                            onPermissionChange={onPermissionChange}
                        />
                    </section>
                    <Separator />
                    <section className="h-full w-full">
                        <h2 className="mb-2 font-semibold">
                            Subtasks permissions
                        </h2>
                        <MembersAccessSubtasks
                            currPermissions={currPermissions}
                            onPermissionChange={onPermissionChange}
                        />
                    </section>
                </>
            )}
        </div>
    );
};
