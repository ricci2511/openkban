import React from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';

interface DueDateWarningProps {
    today: boolean;
    overdue: boolean;
}

export const DueDateWarning = ({ today, overdue }: DueDateWarningProps) => {
    return (
        <>
            {today && (
                <span className="flex gap-2">
                    <RiErrorWarningFill className="text-warning" size={20} />
                    <p className="text-xs text-warning">Due date Today</p>
                </span>
            )}
            {overdue && (
                <span className="flex gap-2">
                    <RiErrorWarningFill
                        className="text-destructive"
                        size={20}
                    />
                    <p className="text-xs text-destructive">Due date Overdue</p>
                </span>
            )}
        </>
    );
};
