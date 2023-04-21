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
> & {
    unstyled?: boolean;
};

const PopoverContentBase = React.forwardRef<
    PopoverContentElementRef,
    PopoverContentProps
>(
    (
        { className, align = 'center', sideOffset = 4, unstyled, ...props },
        ref
    ) => (
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                'z-50 outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                !unstyled &&
                    'w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md',
                className
            )}
            {...props}
        />
    )
);
PopoverContentBase.displayName = 'PopoverContentBase';

/**
 * @description Wrapper around the popover content to conditionally render the popover in a portal.
 * Currently there is a bug with scrolling inside of a popover that is rendered in a portal within a dialog.
 * @see: https://github.com/radix-ui/primitives/issues/2028
 */
const PopoverContent = React.forwardRef<
    PopoverContentElementRef,
    PopoverContentProps & { portal?: boolean }
>(({ className, portal, unstyled, ...props }, ref) => {
    return portal ? (
        <PopoverPrimitive.Portal>
            <PopoverContentBase
                ref={ref}
                className={className}
                unstyled={unstyled}
                {...props}
            />
        </PopoverPrimitive.Portal>
    ) : (
        <PopoverContentBase
            ref={ref}
            className={className}
            unstyled={unstyled}
            {...props}
        />
    );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
