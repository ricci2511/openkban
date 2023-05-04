import { MembersAccessProps } from './members-access-section';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';
import { MembersAccessDropdown } from './members-access-dropdown';

export const MembersAccessColumns = ({
    currPermissions,
    onPermissionChange,
}: MembersAccessProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor="create-column" className="flex flex-col gap-1">
                    <span>Create columns</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>create</strong> columns on this
                        board.
                    </span>
                </Label>
                <Switch
                    id="create-column"
                    checked={currPermissions['CREATE_COLUMN']}
                    onCheckedChange={(value) =>
                        onPermissionChange('CREATE_COLUMN', value)
                    }
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Label className="flex flex-col gap-1">
                    <span>Update columns</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>update</strong> their own,
                        other members or admins columns.
                    </span>
                </Label>
                <MembersAccessDropdown
                    action="UPDATE"
                    entity="COLUMN"
                    currPermissions={currPermissions}
                    onPermissionChange={onPermissionChange}
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Label className="flex flex-col gap-1">
                    <span>Delete columns</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>delete</strong> their own,
                        other members or admins columns.
                    </span>
                </Label>
                <MembersAccessDropdown
                    action="DELETE"
                    entity="COLUMN"
                    currPermissions={currPermissions}
                    onPermissionChange={onPermissionChange}
                />
            </div>
        </div>
    );
};
