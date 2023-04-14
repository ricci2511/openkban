import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@lib/helpers';
import { VariantProps, cva } from 'class-variance-authority';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />;
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipVariants = cva(
    'z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
    {
        variants: {
            variant: {
                default:
                    'border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
                destructive:
                    'border-red-500 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-800 dark:text-red-100',
                info: 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-600 dark:bg-sky-800 dark:text-sky-100',
                warning:
                    'border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-800 dark:text-yellow-100',
                success:
                    'border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-800 dark:text-green-100',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);
export interface TooltipProps
    extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
        VariantProps<typeof tooltipVariants> {}

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    TooltipProps
>(({ variant, className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(tooltipVariants({ variant, className }))}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
