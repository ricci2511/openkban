import { Permission } from '@prisma/client';
import {
    useBoardId,
    useMembersPermissions,
    useUpdateMembersPermission,
} from 'store/kanban-store';
import { MembersAccessColumns } from './members-access-columns';
import { MembersAccessTasks } from './members-access-tasks';
import { MembersAccessSubtasks } from './members-access-subtasks';
import { Separator } from '@components/ui/separator';
import { PermissionMap } from 'types/board-types';
import { trpc } from '@lib/trpc';

export interface MembersAccessProps {
    currPermissions: PermissionMap;
    onPermissionChange: (perm: Permission, value: boolean) => void;
}

export const MembersAccessSection = () => {
    const membersPermissions = useMembersPermissions();
    const updateStorePermission = useUpdateMembersPermission();

    const { mutate } = trpc.boardPermissionRouter.update.useMutation();
    const boardId = useBoardId();

    const onPermissionChange = (permission: Permission, access: boolean) => {
        // optimistically update the store permission map
        updateStorePermission(permission, access);

        // api call to update member permissions
        mutate(
            {
                boardId,
                // the permission to update and whether to grant or revoke access to it
                memberPermission: { permission, access },
            },
            {
                // if error, revert the change
                onError: () => updateStorePermission(permission, !access),
            }
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {!membersPermissions && (
                <p>
                    Could not load permission settings for members. Make sure
                    you are an admin before trying again.
                </p>
            )}
            {membersPermissions && (
                <>
                    <section className="h-full w-full">
                        <h2 className="mb-2 font-semibold">
                            Columns permissions
                        </h2>
                        <MembersAccessColumns
                            currPermissions={membersPermissions}
                            onPermissionChange={onPermissionChange}
                        />
                    </section>
                    <Separator />
                    <section className="h-full w-full">
                        <h2 className="mb-2 font-semibold">
                            Tasks permissions
                        </h2>
                        <MembersAccessTasks
                            currPermissions={membersPermissions}
                            onPermissionChange={onPermissionChange}
                        />
                    </section>
                    <Separator />
                    <section className="h-full w-full">
                        <h2 className="mb-2 font-semibold">
                            Subtasks permissions
                        </h2>
                        <MembersAccessSubtasks
                            currPermissions={membersPermissions}
                            onPermissionChange={onPermissionChange}
                        />
                    </section>
                </>
            )}
        </div>
    );
};
