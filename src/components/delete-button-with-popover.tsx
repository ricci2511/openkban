import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import { Button, ButtonProps } from './ui/button';
import { Trash } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface DeleteButtonWithPopoverProps extends PropsWithChildren, ButtonProps {
    onDelete: () => void;
}

export const DeleteButtonWithPopover = ({
    onDelete,
    children,
    ...buttonProps
}: DeleteButtonWithPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button {...buttonProps}>
                    <Trash className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <p className="break-words text-sm">{children}</p>
                <Button
                    variant="destructive"
                    size="sm"
                    className="btn-error btn-sm btn mt-2 w-full"
                    onClick={onDelete}
                >
                    Remove
                </Button>
            </PopoverContent>
        </Popover>
    );
};
