import React, { ComponentProps } from 'react';
import { FieldValues } from 'react-hook-form';
import { Input } from 'react-daisyui';
import { FormElementProps } from 'types/form-types';

interface FormInputProps<TFormValues extends FieldValues>
    extends FormElementProps<TFormValues>,
        ComponentProps<typeof Input> {}

const FormInput = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    ...rest
}: FormInputProps<TFormValues>) => {
    const errorMessages = errors && errors[registerName];

    return (
        <>
            <Input
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

export default FormInput;
