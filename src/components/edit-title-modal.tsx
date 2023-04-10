import React from 'react';
import { Button, Form } from 'react-daisyui';
import { TitleInput } from '@lib/schemas/board-schemas';
import { z } from 'zod';
import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@server/routers';
import { UseTRPCMutationResult } from '@trpc/react-query/shared';
import { useTitleForm } from '@hooks/use-title-form';
import {
    ModalType,
    Modal,
    ModalHeader,
    ModalBody,
    ModalActions,
} from './ui/modal';
import { FormInput } from './ui/form-input';

type HasIdAndTitle = { id: string } & TitleInput;

interface EditTitleModalProps<TEntity extends HasIdAndTitle> extends ModalType {
    entity: TEntity;
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

/**
 * @description Simple reusable modal used to edit the title of an entity.
 * The entity must have at least an id and a title.
 * @returns A modal with a form to edit the title of an entity.
 */
export const EditTitleModal = <TEntity extends HasIdAndTitle>({
    entity,
    updateMutation,
    zodString,
    name,
    oldTitle,
    open,
    closeModal,
}: EditTitleModalProps<TEntity>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useTitleForm(zodString);

    const { mutate: updateTitle, isLoading } = updateMutation;

    const onSubmit = handleSubmit(({ title }) => {
        if (title === entity.title) {
            closeModal();
            return;
        }
        updateTitle({ id: entity.id, title });
    });

    return (
        <Modal open={open} closeModal={closeModal} className="max-w-2xl">
            <ModalHeader className="mt-3 text-2xl font-semibold">
                Edit {name} title of{' '}
                <span className="font-bold">{`'${oldTitle}'`}</span>
            </ModalHeader>
            <ModalBody>
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
            </ModalBody>
            <ModalActions>
                <Button
                    type="submit"
                    form="edit-title-form"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Update title
                </Button>
            </ModalActions>
        </Modal>
    );
};
