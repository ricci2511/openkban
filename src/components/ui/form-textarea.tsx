import React from 'react';
import { FieldValues } from 'react-hook-form';
import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';
import { TextareaProps, Textarea } from './textarea';
import { cn } from '@lib/helpers';

interface FormTextareaProps<TFormValues extends FieldValues>
    extends FormElementProps<TFormValues>,
        TextareaProps {}

export const FormTextarea = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    className,
    ...rest
}: FormTextareaProps<TFormValues>) => {
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, registerName);

    return (
        <>
            <Textarea
                aria-invalid={!!(errors && errorMessages)}
                className={cn(errorMessages && 'textarea-error', className)}
                {...rest}
                {...(register && register(registerName, registerRules))}
            />
            {errorMessages && (
                <p className="mt-2 text-sm text-error">
                    {errorMessages.message}
                </p>
            )}
        </>
    );
};
