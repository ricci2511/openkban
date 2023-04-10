import React from 'react';
import { Button, Tooltip } from 'react-daisyui';
import { HiOutlineStar } from 'react-icons/hi';

interface FavouriteButtonProps {
    favourite: boolean;
    updateFavourite: () => void;
}
const FavouriteButton = ({
    favourite,
    updateFavourite,
}: FavouriteButtonProps) => {
    return (
        <Tooltip
            message={favourite ? 'Remove from favourites' : 'Add to favourites'}
            color={favourite ? 'error' : 'primary'}
            position="right"
        >
            <Button
                type="button"
                aria-describedby="Click this to add the selected board to your favourites"
                color="ghost"
                size="xs"
                onClick={updateFavourite}
            >
                <HiOutlineStar
                    fill={favourite ? '#FFD100' : 'white'}
                    stroke="black"
                    strokeWidth={1}
                    size={15}
                />
            </Button>
        </Tooltip>
    );
};

export default FavouriteButton;
