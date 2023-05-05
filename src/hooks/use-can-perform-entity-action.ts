import { KanbanAction, KanbanEntity } from 'types/board-types';
import { useSession } from 'next-auth/react';
import {
    useBoardUsers,
    useMembersPermissions,
    useMyRole,
} from 'store/kanban-store';

/**
 *
 * @param entity the entity type to check permissions for
 * @param action the action type to check permissions for
 * @param entityOwnerId the owner of the entity, which is the board user id
 * @returns
 */
export const useCanPerformEntityAction = (
    entity: KanbanEntity,
    action: KanbanAction,
    entityOwnerId?: string
) => {
    const myRole = useMyRole();
    const boardUsers = useBoardUsers();
    const membersPermissions = useMembersPermissions();
    const { data: session } = useSession();

    // simple base cases for VIEWER and ADMIN roles
    // VIEWERs can't do anything, ADMINs can do everything
    if (myRole === 'VIEWER') return false;
    if (myRole === 'ADMIN') return true;
    if (!membersPermissions) return false;

    // MEMBERs are dependent on the current member permissions set by the ADMIN
    if (action === 'CREATE') {
        // CREATE actions dont have any action type
        return membersPermissions[`CREATE_${entity}`];
    }

    if (!entityOwnerId) {
        throw new Error(
            `entityOwnerId param is required for ${action} ${entity} action`
        );
    }

    // find the owner of the entity and check if the current user is the owner
    const owner = boardUsers.find((bu) => bu.id === entityOwnerId)!;
    const isOwner = owner.user.id === session?.user?.id;

    /**
     * UPDATE and DELETE actions have an action type (OWN, ADMINS, MEMBERS)
     * When the current user is the owner, having the OWN action type is enough.
     * When the ADMIN is the owner, having the ADMINS action type is mandatory.
     * When a MEMBER is the owner, having the MEMBERS action type is mandatory.
     * @see: Permission enum in prisma/schema.prisma
     */
    const actionType = isOwner
        ? 'OWN'
        : owner.role === 'ADMIN'
        ? 'ADMINS'
        : 'MEMBERS';

    return membersPermissions[`${action}_${actionType}_${entity}`];
};
