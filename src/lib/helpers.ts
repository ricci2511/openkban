/**
 * crypto.randomUUID() would be cleaner, but this approach is more compatible with older browsers
 * @returns a random id for client side use
 */
export const randomId = () => {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
};
