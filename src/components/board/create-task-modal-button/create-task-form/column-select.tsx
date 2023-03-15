import { BoardTaskCreation } from '@lib/schemas/board-schemas';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-daisyui';
import FormSelect from '@components/ui/form/form-select';
import InfoTooltip from '@components/ui/tooltip/info-tooltip';
import { useBoardId } from 'store/board-store';
import { useColumns } from 'store/columns-tasks-store';

const ColumnSelect = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<BoardTaskCreation>();
    const boardId = useBoardId();
    const columns = useColumns(boardId!);

    return (
        <span>
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
        </span>
    );
};

export default ColumnSelect;
