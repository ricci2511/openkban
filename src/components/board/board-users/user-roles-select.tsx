import {
    SelectGroup,
    SelectItem,
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from '@components/ui/select';
import { BoardUserRole } from '@prisma/client';
import { SelectTriggerProps } from '@radix-ui/react-select';
import { BOARD_USER_ROLES } from '@lib/constants';

interface UserRolesSelectProps extends SelectTriggerProps {
    admin: boolean;
    defaultValue?: BoardUserRole;
    disabled?: boolean;
    onRoleChange?: (role: BoardUserRole) => void;
}

export const UserRolesSelect = ({
    admin,
    defaultValue,
    disabled,
    onRoleChange,
    ...props
}: UserRolesSelectProps) => {
    return (
        <Select
            defaultValue={defaultValue}
            onValueChange={onRoleChange}
            disabled={disabled}
        >
            <SelectTrigger {...props}>
                <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {BOARD_USER_ROLES.map((role) => (
                        <SelectItem
                            key={role}
                            value={role}
                            disabled={role === 'ADMIN' && !admin}
                        >
                            {role}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
