import React from 'react';
import Dialog, { DialogType } from '../dialog';
import { Button, Form, Input, Modal } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { TitleInput, titleSchema } from '@lib/schemas/board-schemas';
import FormInput from './form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@server/router';
import { UseTRPCMutationResult } from '@trpc/react-query/shared';

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
    } = useForm<TitleInput>({
        resolver: zodResolver(titleSchema(zodString)),
    });

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
            <Modal.Header className="mt-3 text-2xl font-bold">
                Edit {name} title
            </Modal.Header>
            <Modal.Body>
                <Form className="mb-4 w-full" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <span className="w-full md:w-1/2">
                            <Form.Label title={`Old ${name} title`} />
                            <Input
                                type="text"
                                name="old-title"
                                className="w-full"
                                defaultValue={oldTitle}
                                size="lg"
                                disabled
                            />
                        </span>
                        <span className="w-full md:w-1/2">
                            <Form.Label title={`New ${name} title`} />
                            <FormInput<TitleInput>
                                register={register}
                                registerName="title"
                                registerRules={{ required: true }}
                                errors={errors}
                                type="text"
                                placeholder={`${name} title...`}
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                                autoFocus
                            />
                        </span>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Actions>
                <Button
                    color="primary"
                    onClick={onSubmit}
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
