/**
 * @category Auth
 */
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
/**
 * at least 8 characters long
 * must contain 1 uppercase letter, 1 lowercase letter and 1 number
 * can contain special characters
 */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
export const INVALID_EMAIL = 'Invalid email address';
export const INVALID_USERNAME = 'Username should be at least 3 characters long';
export const INVALID_PASSWORD = 'Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase and 1 number';
