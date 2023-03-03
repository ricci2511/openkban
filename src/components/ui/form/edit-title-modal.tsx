import React from 'react';
import PortalModal from '../modal/portal-modal';
import { Button, Form, Input, Modal } from 'react-daisyui';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { TitleInput } from '@lib/schemas/board-schemas';
import FormInput from './form-input';

interface EditTitleModalProps {
    open: boolean;
    closeModal: () => void;
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
    closeModal,
    name,
    formRegister,
    errors,
    onSubmit,
    isLoading,
    oldTitle,
}: EditTitleModalProps) => {
    return (
        <PortalModal open={open} closeModal={closeModal} className="max-w-2xl">
            <Modal.Header className="mt-3 text-2xl font-bold">
                Edit {name} title
            </Modal.Header>
            <Modal.Body>
                <Form className="mb-4 w-full" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <span className="w-1/2">
                            <Form.Label title={`Old ${name} title`} />
                            <Input
                                type="text"
                                name="old-title"
                                className="w-full max-w-sm"
                                defaultValue={oldTitle}
                                size="lg"
                                disabled
                            />
                        </span>
                        <span className="w-1/2">
                            <Form.Label title={`New ${name} title`} />
                            <FormInput<TitleInput>
                                register={formRegister}
                                registerName={formRegister('title').name}
                                registerRules={{ required: true }}
                                errors={errors}
                                type="text"
                                placeholder={`${name} title...`}
                                className="w-full max-w-sm"
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
        </PortalModal>
    );
};

export default EditTitleModal;
