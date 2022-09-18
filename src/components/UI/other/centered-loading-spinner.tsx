import React from 'react';
import { BarsScaleFade } from 'react-svg-spinners';

const CenteredLoadingSpinner = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <BarsScaleFade width={40} height={40} />
        </div>
    );
};

export default CenteredLoadingSpinner;
