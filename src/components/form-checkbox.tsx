import { Control, FieldValues, useController } from 'react-hook-form';
import { Label } from '@components/ui/label';
import { Checkbox } from '@components/ui/checkbox';
import { FormElmentPropsWithoutRegister } from 'types/form-types';
import { CheckboxProps } from '@radix-ui/react-checkbox';

interface FormCheckboxProps<TFormValues extends FieldValues>
    extends FormElmentPropsWithoutRegister<TFormValues>,
        Omit<CheckboxProps, 'name'> {
    // name attribute is overriden by useController
    control: Control<TFormValues>;
}

export const FormCheckbox = <TFormValues extends FieldValues>({
    name,
    control,
    rules,
    id,
    children,
}: FormCheckboxProps<TFormValues>) => {
    const { field } = useController({ name, control, rules });

    return (
        <>
            <Checkbox
                {...field}
                id={id}
                value={undefined}
                checked={field.value}
                onCheckedChange={field.onChange}
            />
            <Label htmlFor={id}>{children}</Label>
        </>
    );
};
