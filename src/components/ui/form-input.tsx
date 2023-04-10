import React, { ComponentProps } from 'react';
import { Input } from 'react-daisyui';
import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';

interface FormInputProps<TFormValues>
    extends FormElementProps<TFormValues>,
        ComponentProps<typeof Input> {}

export const FormInput = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    color,
    ...rest
}: FormInputProps<TFormValues>) => {
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, registerName);

    return (
        <>
            <Input
                aria-invalid={!!(errors && errorMessages)}
                color={errorMessages ? 'error' : color}
                bordered
                borderOffset
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
