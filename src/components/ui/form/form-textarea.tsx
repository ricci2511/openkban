import React, { ComponentProps } from 'react';
import { FieldValues } from 'react-hook-form';
import { Textarea } from 'react-daisyui';
import { FormElementProps } from 'types/form-types';

interface FormTextareaProps<TFormValues extends FieldValues>
    extends FormElementProps<TFormValues>,
        ComponentProps<typeof Textarea> {}

const FormTextarea = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    ...rest
}: FormTextareaProps<TFormValues>) => {
    const errorMessages = errors && errors[registerName];

    return (
        <>
            <Textarea
                aria-invalid={!!(errors && errorMessages)}
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

export default FormTextarea;
