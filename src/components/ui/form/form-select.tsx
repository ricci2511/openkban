import React, { ComponentProps } from 'react';
import { FieldValues } from 'react-hook-form';
import { Select } from 'react-daisyui';
import { FormElementProps } from 'types/form-types';

type SelectType = ComponentProps<typeof Select>;

interface FormSelectProps<TFormValues extends FieldValues>
    extends FormElementProps<TFormValues>,
        SelectType {
    children: SelectType['children'];
}

const FormSelect = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    children,
    ...rest
}: FormSelectProps<TFormValues>) => {
    const errorMessages = errors && errors[registerName];

    return (
        <>
            <Select
                aria-invalid={!!(errors && errorMessages)}
                {...rest}
                {...(register && register(registerName, registerRules))}
            >
                {children}
            </Select>
            {errorMessages && (
                <p className="mt-2 text-sm text-error">
                    {errorMessages.message}
                </p>
            )}
        </>
    );
};

export default FormSelect;
