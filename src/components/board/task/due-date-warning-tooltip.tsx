import React from 'react';
import { Tooltip } from 'react-daisyui';
import { RiErrorWarningFill } from 'react-icons/ri';

interface DueDateWarningTooltipProps {
    today: boolean;
    overdue: boolean;
}

const DueDateWarningTooltip = ({
    today,
    overdue,
}: DueDateWarningTooltipProps) => {
    return (
        <>
            {today && !overdue && (
                <Tooltip
                    message="Due date is today!"
                    color="warning"
                    position="right"
                >
                    <RiErrorWarningFill className="text-warning" size={20} />
                </Tooltip>
            )}
            {!today && overdue && (
                <Tooltip
                    message="Due date is overdue!"
                    color="error"
                    position="right"
                >
                    <RiErrorWarningFill className="text-error" size={20} />
                </Tooltip>
            )}
        </>
    );
};

export default DueDateWarningTooltip;
