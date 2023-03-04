import {
    RegisterOptions,
    DeepMap,
    FieldError,
    UseFormRegister,
    Path,
    UnPackAsyncDefaultValues,
    FieldValues,
} from 'react-hook-form';

export type FormElementProps<TFormValues extends FieldValues> = {
    register?: UseFormRegister<TFormValues>;
    registerName: Path<UnPackAsyncDefaultValues<TFormValues>>;
    registerRules?: RegisterOptions;
    errors?: Partial<DeepMap<TFormValues, FieldError>>;
};
