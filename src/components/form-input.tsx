import React from 'react';
import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';
import { cn } from '@lib/helpers';
import { Input, InputProps } from './ui/input';

interface FormInputProps<TFormValues>
    extends FormElementProps<TFormValues>,
        Omit<InputProps, 'name'> {} // name attribute is overriden by register

export const FormInput = <TFormValues extends Record<string, unknown>>({
    register,
    name,
    rules,
    errors,
    className,
    children,
    ...rest
}: FormInputProps<TFormValues>) => {
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, name);

    return (
        <>
            {children ? (
                <div className="flex gap-2">
                    <Input
                        aria-invalid={!!(errors && errorMessages)}
                        className={cn(
                            errorMessages && 'border-destructive/80',
                            className
                        )}
                        {...rest}
                        {...(register && register(name, rules))}
                    />
                    {children}
                </div>
            ) : (
                <Input
                    aria-invalid={!!(errors && errorMessages)}
                    className={cn(
                        errorMessages && 'border-destructive/80',
                        className
                    )}
                    {...rest}
                    {...(register && register(name, rules))}
                />
            )}
            {errorMessages && (
                <p className="mt-1 text-sm text-destructive">
                    {errorMessages.message}
                </p>
            )}
        </>
    );
};
