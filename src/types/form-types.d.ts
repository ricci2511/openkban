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
    registerName: FieldPath<TFormValues>;
    registerRules?: RegisterOptions;
    errors?: FormErrors<TFormValues>;
};
