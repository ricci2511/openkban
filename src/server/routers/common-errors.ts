type Input = 'board' | 'column' | 'task' | 'subtask';

/**
 * @param input the input type (e.g. board, column, task, subtask)
 * @param singular whether the input is singular or plural (e.g. board vs boards)
 * @returns a message for a query error
 */
export const queryError = (input: Input, singular: boolean) =>
    `Could not fetch ${
        singular ? input : input + 's'
    } from the database. Please try again later.`;

/**
 * @param input the input type (e.g. board, column, task, subtask)
 * @returns a message for a create mutation error
 */
export const createError = (input: Input) =>
    `Could not create ${input}. Please try again later.`;

/**
 * @param input the input type (e.g. board, column, task, subtask)
 * @returns a message for a delete mutation error
 */
export const deleteError = (input: Input) =>
    `Could not delete ${input}. Please try again later.`;

/**
 * @param input the input type (e.g. board, column, task, subtask)
 * @returns a message for a update mutation error
 */
export const updateError = (input: Input) =>
    `Could not update ${input}. Please try again later.`;
