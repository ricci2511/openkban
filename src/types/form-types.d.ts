import {
    RegisterOptions,
    DeepMap,
    FieldError,
    UseFormRegister,
    Path,
    UnPackAsyncDefaultValues,
    FieldPath,
} from 'react-hook-form';

export type FormErrors<TFormValues> = Partial<DeepMap<TFormValues, FieldError>>;

export type FormElementProps<TFormValues> = {
    register: UseFormRegister<TFormValues>;
    name: FieldPath<TFormValues>;
    rules?: RegisterOptions;
    errors?: FormErrors<TFormValues>;
};

export type FormElmentPropsWithoutRegister<TFormValues> = Omit<
    FormElementProps<TFormValues>,
    'register'
>;
