import { FormElementProps } from 'types/form-types';
import get from 'lodash.get';
import React, { ComponentProps } from 'react';
import { Input, InputGroup } from 'react-daisyui';

interface FormInputGroupProps<TFormValues>
    extends FormElementProps<TFormValues>,
        ComponentProps<typeof Input> {}

const FormInputGroup = <TFormValues extends Record<string, unknown>>({
    register,
    registerName,
    registerRules,
    errors,
    children,
    ...rest
}: FormInputGroupProps<TFormValues>) => {
    // lodash get is used in case errors includes nested fields of type FieldError[] (e.g. columnTitles.0)
    const errorMessages = get(errors, registerName);

    return (
        <>
            <InputGroup>
                <Input
                    aria-invalid={!!(errors && errorMessages)}
                    {...rest}
                    {...(register && register(registerName, registerRules))}
                />
                {children}
            </InputGroup>
            {errorMessages && (
                <p className="mt-2 text-sm text-error">
                    {errorMessages.message}
                </p>
            )}
        </>
    );
};

export default FormInputGroup;
