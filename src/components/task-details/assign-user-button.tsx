import { Button } from '@components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import { Plus } from 'lucide-react';
import { AssignUserContent } from './assign-user-content';

export const AssignUserButton = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full" size="sm">
                    <Plus className="h-3 w-3" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
                <AssignUserContent />
            </PopoverContent>
        </Popover>
    );
};
