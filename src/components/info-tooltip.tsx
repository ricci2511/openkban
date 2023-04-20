import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import {
    TooltipContentProps,
    TooltipTriggerProps,
} from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

interface InfoTooltipProps extends TooltipTriggerProps {
    message: string;
    side: TooltipContentProps['side'];
}

export const InfoTooltip = ({ message, side, ...props }: InfoTooltipProps) => {
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger {...props}>
                    <Info size={18} />
                </TooltipTrigger>
                <TooltipContent variant="info" size="sm" side={side}>
                    {message}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
