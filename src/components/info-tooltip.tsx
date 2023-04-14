import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import { RxInfoCircled } from 'react-icons/rx';
import { TooltipContentProps } from '@radix-ui/react-tooltip';

interface InfoTooltipProps {
    message: string;
    side: TooltipContentProps['side'];
}

export const InfoTooltip = ({ message, side }: InfoTooltipProps) => {
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger>
                    <RxInfoCircled size={18} />
                </TooltipTrigger>
                <TooltipContent variant="info" side={side}>
                    {message}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
