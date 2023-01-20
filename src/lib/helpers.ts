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
