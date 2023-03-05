import {
    RegisterOptions,
    DeepMap,
    FieldError,
    UseFormRegister,
    Path,
    UnPackAsyncDefaultValues,
} from 'react-hook-form';

export type FormErrors<TFormValues> = Partial<DeepMap<TFormValues, FieldError>>;

export type FormElementProps<TFormValues> = {
    register?: UseFormRegister<TFormValues>;
    registerName: Path<UnPackAsyncDefaultValues<TFormValues>>;
    registerRules?: RegisterOptions;
    errors?: FormErrors<TFormValues>;
};
