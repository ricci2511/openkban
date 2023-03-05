import React from 'react';
import { Tooltip, TooltipProps } from 'react-daisyui';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const InfoTooltip = ({ message, position }: TooltipProps) => {
    return (
        <Tooltip
            message={message}
            position={position}
            color="info"
            className="text-xs"
        >
            <HiOutlineInformationCircle size={18} />
        </Tooltip>
    );
};

export default InfoTooltip;
