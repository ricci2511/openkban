'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@lib/helpers';
import { VariantProps, cva } from 'class-variance-authority';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipVariants = cva(
    'z-50 overflow-hidden rounded-md border shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
    {
        variants: {
            variant: {
                default: 'bg-popover/90 text-popover-foreground',
                destructive:
                    'border-destructive bg-destructive/90 text-destructive-foreground',
                info: 'border-info bg-info/90 text-info-foreground',
                warning: 'border-warning bg-warning/90 text-warning-foreground',
                success: 'border-success bg-success/90 text-success-foreground',
            },
            size: {
                default: 'px-3 py-1.5 text-sm',
                sm: 'px-2 py-1 text-xs',
                lg: 'px-4 py-2 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
export interface TooltipProps
    extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
        VariantProps<typeof tooltipVariants> {}

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    TooltipProps
>(({ className, variant, size, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(tooltipVariants({ variant, size, className }))}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
