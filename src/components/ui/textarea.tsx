import { cn } from '@lib/helpers';
import React from 'react';

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'textarea-bordered textarea flex w-full',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
