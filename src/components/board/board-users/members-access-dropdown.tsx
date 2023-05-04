import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { KanbanEntity } from 'types/board-types';
import { MembersAccessProps } from './members-access-section';

interface MembersAccessDropdownProps extends MembersAccessProps {
    action: 'UPDATE' | 'DELETE';
    entity: KanbanEntity;
}

export const MembersAccessDropdown = ({
    action,
    entity,
    currPermissions,
    onPermissionChange,
}: MembersAccessDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                    {action.substring(0, 1) + action.substring(1).toLowerCase()}{' '}
                    options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={currPermissions[`${action}_OWN_${entity}`]}
                    onCheckedChange={(value) =>
                        onPermissionChange(`${action}_OWN_${entity}`, value)
                    }
                >
                    Own {entity.toLowerCase()}s
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={currPermissions[`${action}_MEMBERS_${entity}`]}
                    onCheckedChange={(value) =>
                        onPermissionChange(`${action}_MEMBERS_${entity}`, value)
                    }
                >
                    Other members {entity.toLowerCase()}s
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={currPermissions[`${action}_ADMINS_${entity}`]}
                    onCheckedChange={(value) =>
                        onPermissionChange(`${action}_ADMINS_${entity}`, value)
                    }
                >
                    Admins {entity.toLowerCase()}s
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
