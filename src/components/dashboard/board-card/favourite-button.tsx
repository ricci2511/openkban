import React from 'react';
import { HiOutlineStar } from 'react-icons/hi';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';

interface FavouriteButtonProps {
    favourite: boolean;
    updateFavourite: () => void;
}
export const FavouriteButton = ({
    favourite,
    updateFavourite,
}: FavouriteButtonProps) => {
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger onClick={updateFavourite}>
                    <HiOutlineStar
                        fill={favourite ? '#FFD100' : 'white'}
                        stroke="black"
                        strokeWidth={1}
                        size={15}
                    />
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    sideOffset={5}
                    variant={favourite ? 'destructive' : 'default'}
                >
                    <p>
                        {favourite
                            ? 'Remove from favourites'
                            : 'Add to favourites'}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
