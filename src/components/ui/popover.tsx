import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@lib/helpers';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * @description element to position the PopoverContent against in case PopoverTrigger is not present
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

type PopoverContentElementRef = React.ElementRef<
    typeof PopoverPrimitive.Content
>;
type PopoverContentProps = React.ComponentPropsWithoutRef<
    typeof PopoverPrimitive.Content
>;

const PopoverContentBase = React.forwardRef<
    PopoverContentElementRef,
    PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
            'z-50 w-72 rounded-md border border-slate-100 bg-white p-4 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 dark:border-slate-800 dark:bg-slate-800',
            className
        )}
        {...props}
    />
));
PopoverContentBase.displayName = 'PopoverContentBase';

/**
 * @description Wrapper around the popover content to conditionally render the popover in a portal.
 * Currently there is a bug with scrolling inside of a popover that is rendered in a portal within a dialog.
 * @see: https://github.com/radix-ui/primitives/issues/2028
 */
const PopoverContent = React.forwardRef<
    PopoverContentElementRef,
    PopoverContentProps & { portal?: boolean }
>(({ className, portal, ...props }, ref) => {
    return portal ? (
        <PopoverPrimitive.Portal>
            <PopoverContentBase ref={ref} className={className} {...props} />
        </PopoverPrimitive.Portal>
    ) : (
        <PopoverContentBase ref={ref} className={className} {...props} />
    );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
