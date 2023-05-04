import { MembersAccessProps } from './members-access-section';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';
import { MembersAccessDropdown } from './members-access-dropdown';

export const MembersAccessTasks = ({
    currPermissions,
    onPermissionChange,
}: MembersAccessProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor="create-task" className="flex flex-col gap-1">
                    <span>Create tasks</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>create</strong> tasks on this
                        board.
                    </span>
                </Label>
                <Switch
                    id="create-task"
                    checked={currPermissions['CREATE_TASK']}
                    onCheckedChange={(value) =>
                        onPermissionChange('CREATE_TASK', value)
                    }
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Label className="flex flex-col gap-1">
                    <span>Update tasks</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>update</strong> their own,
                        other members or admins tasks.
                    </span>
                </Label>
                <MembersAccessDropdown
                    action="UPDATE"
                    entity="TASK"
                    currPermissions={currPermissions}
                    onPermissionChange={onPermissionChange}
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Label className="flex flex-col gap-1">
                    <span>Delete tasks</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>delete</strong> their own,
                        other members or admins tasks.
                    </span>
                </Label>
                <MembersAccessDropdown
                    action="DELETE"
                    entity="TASK"
                    currPermissions={currPermissions}
                    onPermissionChange={onPermissionChange}
                />
            </div>
        </div>
    );
};
