import { MembersAccessProps } from './members-access-section';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';
import { MembersAccessDropdown } from './members-access-dropdown';

export const MembersAccessSubtasks = ({
    currPermissions,
    onPermissionChange,
}: MembersAccessProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor="create-subtask" className="flex flex-col gap-1">
                    <span>Create subtasks</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>create</strong> subtasks on
                        this board.
                    </span>
                </Label>
                <Switch
                    id="create-subtask"
                    checked={currPermissions['CREATE_SUBTASK']}
                    onCheckedChange={(value) =>
                        onPermissionChange('CREATE_SUBTASK', value)
                    }
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Label className="flex flex-col gap-1">
                    <span>Update subtasks</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>update</strong> their own,
                        other members or admins subtasks.
                    </span>
                </Label>
                <MembersAccessDropdown
                    action="UPDATE"
                    entity="SUBTASK"
                    currPermissions={currPermissions}
                    onPermissionChange={onPermissionChange}
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Label className="flex flex-col gap-1">
                    <span>Delete subtasks</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Allow members to <strong>delete</strong> their own,
                        other members or admins subtasks.
                    </span>
                </Label>
                <MembersAccessDropdown
                    action="DELETE"
                    entity="SUBTASK"
                    currPermissions={currPermissions}
                    onPermissionChange={onPermissionChange}
                />
            </div>
        </div>
    );
};
