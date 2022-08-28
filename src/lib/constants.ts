// RFC2822 standard email validation 
export const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
/**
 * at least 8 characters long
 * must contain 1 uppercase letter, 1 lowercase letter and 1 number
 * can contain special characters
 */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
export const INVALID_EMAIL = 'Invalid email address';
export const INVALID_PASSWORD = 'Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase and 1 number';
