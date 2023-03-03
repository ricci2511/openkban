import React, { ComponentPropsWithoutRef } from 'react';
import {
    RegisterOptions,
    DeepMap,
    FieldError,
    UseFormRegister,
    Path,
    UnPackAsyncDefaultValues,
    FieldValues,
} from 'react-hook-form';
import { Input } from 'react-daisyui';

export interface FormInputProps<TFormValues extends FieldValues>
    extends ComponentPropsWithoutRef<typeof Input> {
    register?: UseFormRegister<TFormValues>;
    registerName: Path<UnPackAsyncDefaultValues<TFormValues>>;
    registerRules?: RegisterOptions;
    errors?: Partial<DeepMap<TFormValues, FieldError>>;
}

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
