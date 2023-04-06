import React from 'react';
import Dialog, { DialogType } from '../dialog';
import { Button, Form, Input, Modal } from 'react-daisyui';
import { TitleInput } from '@lib/schemas/board-schemas';
import FormInput from './form-input';
import { z } from 'zod';
import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@server/routers';
import { UseTRPCMutationResult } from '@trpc/react-query/shared';
import { useTitleForm } from '@hooks/use-title-form';

type HasIdAndTitle = { id: string } & TitleInput;

interface EditTitleModalProps<TEntity extends HasIdAndTitle>
    extends DialogType {
    entity: TEntity;
    // TODO: fix type
    updateMutation: UseTRPCMutationResult<
        TEntity,
        TRPCClientErrorLike<AppRouter>,
        Optional<HasIdAndTitle, 'title'>,
        unknown
    >;
    zodString: z.ZodString;
    name: string;
    oldTitle: string;
}

const EditTitleModal = <TEntity extends HasIdAndTitle>({
    entity,
    updateMutation,
    zodString,
    name,
    oldTitle,
    open,
    closeDialog,
}: EditTitleModalProps<TEntity>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useTitleForm(zodString);

    const { mutate: updateTitle, isLoading } = updateMutation;

    const onSubmit = handleSubmit(({ title }) => {
        if (title === entity.title) {
            closeDialog();
            return;
        }
        updateTitle({ id: entity.id, title });
    });

    return (
        <Dialog open={open} closeDialog={closeDialog} className="max-w-2xl">
            <Modal.Header className="mt-3 text-2xl font-semibold">
                Edit {name} title of{' '}
                <span className="font-bold">{`'${oldTitle}'`}</span>
            </Modal.Header>
            <Modal.Body>
                <Form
                    className="mb-4 w-full"
                    onSubmit={onSubmit}
                    id="edit-title-form"
                >
                    <fieldset className="w-full">
                        <Form.Label
                            title={`New title`}
                            htmlFor={`new-${name}-title`}
                        />
                        <FormInput<TitleInput>
                            type="text"
                            id={`new-${name}-title`}
                            placeholder={`${name} title...`}
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                            autoFocus
                            register={register}
                            registerName="title"
                            registerRules={{ required: true }}
                            errors={errors}
                        />
                    </fieldset>
                </Form>
            </Modal.Body>
            <Modal.Actions>
                <Button
                    type="submit"
                    form="edit-title-form"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Update title
                </Button>
            </Modal.Actions>
        </Dialog>
    );
};

export default EditTitleModal;
