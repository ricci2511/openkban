import { Role, Permission } from '@prisma/client';

// all board roles
export const BOARD_USER_ROLES = Object.values(Role);

// board permissions
export const ALL_BOARD_PERMISSIONS = Object.values(Permission);
export const DEFAULT_MEMBER_BOARD_PERMISSIONS: Permission[] = [
    'CREATE_COLUMN',
    'CREATE_TASK',
    'CREATE_SUBTASK',
    'DELETE_OWN_COLUMN',
    'DELETE_OWN_TASK',
    'DELETE_OWN_SUBTASK',
    'UPDATE_OWN_COLUMN',
    'UPDATE_OWN_TASK',
    'UPDATE_OWN_SUBTASK',
];

// max values
export const MAX_COLUMNS = 8;
export const MAX_BOARD_USERS = 6;

// default column titles layout
export const DEFAULT_COLUMN_TITLES = [
    'To Do',
    'In Progress',
    'Testing',
    'Done',
];

export const PRESET_COLORS = [
    '#570df8',
    '#f000b8',
    '#22c55e',
    '#37cdbe',
    '#0ea5e9',
    '#fbbf24',
    '#ef4444',
];
