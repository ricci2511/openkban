import { BoardUserRole } from '@prisma/client';

export const BOARD_USER_ROLES = Object.values(BoardUserRole);

export const MAX_COLUMNS = 8;
export const MAX_BOARD_USERS = 6;

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
