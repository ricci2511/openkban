import React from 'react';
import { BarsScaleFade } from 'react-svg-spinners';

interface LoadingSpinnerProps {
    centered?: boolean;
    width?: number;
    height?: number;
}

const CustomLoadingSpinner = ({
    centered = false,
    width = 40,
    height = 40,
}: LoadingSpinnerProps) => {
    const centeredClasses =
        'flex min-h-screen w-full items-center justify-center';
    const notCenteredClasses = 'mx-auto flex items-center justify-center';

    return (
        <div className={centered ? centeredClasses : notCenteredClasses}>
            <BarsScaleFade width={width} height={height} />
        </div>
    );
};

export default CustomLoadingSpinner;
