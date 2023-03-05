import React, { ComponentProps } from 'react';
import { FieldValues } from 'react-hook-form';
import { Select } from 'react-daisyui';
import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';

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
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, registerName);

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
