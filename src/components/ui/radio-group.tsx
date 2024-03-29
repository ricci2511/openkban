import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@lib/helpers';
import { VariantProps, cva } from 'class-variance-authority';

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn('grid gap-2', className)}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioCircleVariants = cva(
    'text-foreground h-2.5 w-2.5 animate-in zoom-in-50',
    {
        variants: {
            variant: {
                default: 'fill-foreground',
                primary: 'fill-primary',
                destructive: 'fill-destructive',
                info: 'fill-info',
                warning: 'fill-warning',
                success: 'fill-success',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface RadioGroupItemProps
    extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
        VariantProps<typeof radioCircleVariants> {}

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    RadioGroupItemProps
>(({ variant, className, children, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                'h-4 w-4 rounded-full border border-border ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle
                    className={cn(radioCircleVariants({ variant, className }))}
                />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
