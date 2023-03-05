import React from 'react';
import Dialog, { DialogType } from '../dialog';
import { Button, Form, Input, Modal } from 'react-daisyui';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { TitleInput } from '@lib/schemas/board-schemas';
import FormInput from './form-input';

interface EditTitleModalProps extends DialogType {
    name: string;
    formRegister: UseFormRegister<TitleInput>;
    errors: Partial<FieldErrorsImpl<TitleInput>>;
    onSubmit: (
        e?: React.BaseSyntheticEvent<object, any, any> | undefined
    ) => Promise<void>;
    isLoading: boolean;
    oldTitle: string;
}

const EditTitleModal = ({
    open,
    closeDialog,
    name,
    formRegister,
    errors,
    onSubmit,
    isLoading,
    oldTitle,
}: EditTitleModalProps) => {
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
                                register={formRegister}
                                registerName="title"
                                registerRules={{ required: true }}
                                errors={errors}
                                type="text"
                                placeholder={`${name} title...`}
                                className="w-full"
                                color={errors.title ? 'error' : undefined}
                                size="lg"
                                bordered
                                borderOffset
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
