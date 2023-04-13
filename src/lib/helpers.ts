import {
    AnimateLayoutChanges,
    defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

/**
 * a function that determines whether to animate layout changes when interacting with sortable items (dnd-kit)
 * @param args
 * @returns boolean indicating whether to animate layout changes
 */
export const animateLayoutChanges = (
    args: Parameters<AnimateLayoutChanges>[0]
) => {
    const { isSorting, wasDragging } = args;

    if (isSorting || wasDragging) {
        return defaultAnimateLayoutChanges(args);
    }

    return true;
};

/**
 * crypto.randomUUID() would be cleaner, but this approach is more compatible with older browsers
 * @returns a random id for client side use
 */
export const randomId = () => {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
};

/**
 * @param array
 * @returns a function that returns a random element from the array, without repetition
 */
export const randomNoRepeats = <T>(
    array: ReadonlyArray<T> | T[]
): (() => T) => {
    var copy = array.slice(0);
    return () => {
        if (copy.length < 1) {
            copy = array.slice(0);
        }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
};
