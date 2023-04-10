import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-daisyui';
import { useColumns } from 'store/kanban-store';
import { InfoTooltip } from '@components/ui/info-tooltip';
import { FormSelect } from '@components/ui/form-select';

export const ColumnSelect = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const columns = useColumns();

    return (
        <>
            <Form.Label
                title="Column"
                htmlFor="column"
                className="justify-start gap-2"
            >
                <InfoTooltip
                    message="Pick the column you want to add the task to"
                    position="right"
                />
            </Form.Label>
            <FormSelect<BoardTaskCreation>
                id="column"
                defaultValue="default"
                className="w-full max-w-xs"
                register={register}
                registerName="columnId"
                errors={errors}
            >
                {[
                    <option key="default" value="default" disabled>
                        Which column?
                    </option>,
                ].concat(
                    columns.map(({ id, title }) => (
                        <option key={id} value={id}>
                            {title}
                        </option>
                    ))
                )}
            </FormSelect>
        </>
    );
};
