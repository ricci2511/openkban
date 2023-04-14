import React from 'react';
import { TitleInput } from '@lib/schemas/board-schemas';
import { z } from 'zod';
import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@server/routers';
import { UseTRPCMutationResult } from '@trpc/react-query/shared';
import { useTitleForm } from '@hooks/use-title-form';
import { FormInput } from './ui/form-input';
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { cn } from '@lib/helpers';

type HasIdAndTitle = { id: string } & TitleInput;

interface EditTitleDialogProps<TEntity extends HasIdAndTitle> {
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
    closeDialog: () => void;
}

/**
 * @description Simple reusable modal used to edit the title of an entity.
 * The entity must have at least an id and a title.
 * @returns A modal with a form to edit the title of an entity.
 */
export const EditTitleDialog = <TEntity extends HasIdAndTitle>({
    entity,
    updateMutation,
    zodString,
    name,
    oldTitle,
    closeDialog,
}: EditTitleDialogProps<TEntity>) => {
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Edit {name} title of{' '}
                    <span className="font-bold">{`'${oldTitle}'`}</span>
                </DialogTitle>
            </DialogHeader>
            <form
                role="form"
                id="edit-title-form"
                className="mb-4 w-full"
                onSubmit={onSubmit}
            >
                <div className="w-full">
                    <Label htmlFor={`new-${name}-title`}>New title</Label>
                    <FormInput<TitleInput>
                        type="text"
                        id={`new-${name}-title`}
                        placeholder={`${name} title...`}
                        className="mt-1"
                        disabled={isLoading}
                        register={register}
                        registerName="title"
                        registerRules={{ required: true }}
                        errors={errors}
                        autoFocus
                    />
                </div>
            </form>
            <DialogFooter>
                <button
                    type="submit"
                    form="edit-title-form"
                    className={cn(
                        'btn-primary btn',
                        isLoading && 'loading disabled'
                    )}
                >
                    Update title
                </button>
            </DialogFooter>
        </DialogContent>
    );
};
