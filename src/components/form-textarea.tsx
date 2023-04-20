import React from 'react';
import { FieldValues } from 'react-hook-form';
import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';
import { cn } from '@lib/helpers';
import { TextareaProps, Textarea } from './ui/textarea';

interface FormTextareaProps<TFormValues extends FieldValues>
    extends FormElementProps<TFormValues>,
        Omit<TextareaProps, 'name'> {} // name attribute is overriden by register

export const FormTextarea = <TFormValues extends Record<string, unknown>>({
    register,
    name,
    rules,
    errors,
    className,
    ...rest
}: FormTextareaProps<TFormValues>) => {
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, name);

    return (
        <>
            <Textarea
                aria-invalid={!!(errors && errorMessages)}
                className={cn(errorMessages && 'textarea-error', className)}
                {...rest}
                {...(register && register(name, rules))}
            />
            {errorMessages && (
                <p className="text-error mt-2 text-sm">
                    {errorMessages.message}
                </p>
            )}
        </>
    );
};
