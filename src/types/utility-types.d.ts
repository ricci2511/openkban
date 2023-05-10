// makes field k of type T optional
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// makes field k of type T required while keeping the rest of the fields optional
type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// makes field k of type T non-nullable
type NonNullableField<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};

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
