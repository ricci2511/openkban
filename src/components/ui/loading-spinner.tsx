import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingSpinnerProps {
    centered?: boolean;
    width?: number;
    height?: number;
}

const centeredClasses = 'flex min-h-screen w-full items-center justify-center';
const notCenteredClasses = 'mx-auto flex items-center justify-center';

export const LoadingSpinner = ({
    centered = false,
    width = 40,
    height = 40,
}: LoadingSpinnerProps) => {
    return (
        <div className={centered ? centeredClasses : notCenteredClasses}>
            <Loader2 width={width} height={height} className="animate-spin" />
        </div>
    );
};
