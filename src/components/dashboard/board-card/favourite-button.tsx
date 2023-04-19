import React from 'react';
import { Star } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip';
import { Button } from '@components/ui/button';

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
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-1.5 py-1"
                        onClick={updateFavourite}
                    >
                        <Star
                            fill={favourite ? '#FFD100' : 'white'}
                            stroke="black"
                            strokeWidth={1}
                            size={15}
                        />
                    </Button>
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
