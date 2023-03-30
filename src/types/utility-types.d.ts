// makes field k of type T optional
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Converts each property of type Date in type T to string.
 * It also recursively converts the properties of nested objects and arrays.
 */
type TypeDatesToString<T> = {
    [P in keyof T]: T[P] extends Date
        ? string
        : T[P] extends (infer U)[]
        ? TypeDatesToString<U>[]
        : T[P] extends object
        ? TypeDatesToString<T[P]>
        : T[P];
};
