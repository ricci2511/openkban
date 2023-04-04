import { zodResolver } from '@hookform/resolvers/zod';
import { TitleInput, titleSchema } from '@lib/schemas/board-schemas';
import { UseFormProps, useForm } from 'react-hook-form';
import { z } from 'zod';

type FormPropsWithoutResolver = Omit<UseFormProps<TitleInput>, 'resolver'>;

/**
 * @description A useForm wrapper for simple forms that only have a title input.
 * @param zodString The zod string schema to use for the title input.
 * @param props Optional useForm props you may want to pass in.
 * @returns useForm return object.
 */
export const useTitleForm = (
    zodString: z.ZodString,
    props?: FormPropsWithoutResolver
) => {
    const formMethods = useForm<TitleInput>({
        resolver: zodResolver(titleSchema(zodString)),
        ...props,
    });

    return formMethods;
};
