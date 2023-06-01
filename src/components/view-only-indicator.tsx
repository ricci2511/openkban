import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import { Eye } from 'lucide-react';
import { Button } from './ui/button';

export const ViewOnlyIndicator = () => {
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="sm" className="rounded-full">
                        <Eye className="h-6 w-6" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent variant="info" side="bottom">
                    <p className="text-sm">View Only</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
