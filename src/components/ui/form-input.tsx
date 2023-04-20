import React from 'react';
import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';
import { Input, InputProps } from './input';
import { cn } from '@lib/helpers';

interface FormInputProps<TFormValues>
    extends FormElementProps<TFormValues>,
        InputProps {}

export const FormInput = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    className,
    children,
    ...rest
}: FormInputProps<TFormValues>) => {
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, registerName);

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
                        {...(register && register(registerName, registerRules))}
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
                    {...(register && register(registerName, registerRules))}
                />
            )}
            {errorMessages && (
                <p className="mt-2 text-sm text-destructive">
                    {errorMessages.message}
                </p>
            )}
        </>
    );
};
