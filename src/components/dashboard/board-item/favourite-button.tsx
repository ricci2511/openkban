import useUpdateBoard from '@hooks/use-update-board';
import { Board } from '@prisma/client';
import React, { useState } from 'react';
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
        <div
            className={`${
                favourite ? 'tooltip-error' : 'tooltip-primary'
            } tooltip tooltip-right absolute -top-3 -left-4`}
            data-tip={
                favourite ? 'Remove from favourites' : 'Add to favourites'
            }
        >
            <button
                type="button"
                aria-describedby="Click this to add the selected board to your favourites"
                className="btn-ghost btn-xs btn"
                onClick={updateFavourite}
            >
                <HiOutlineStar
                    fill={favourite ? '#FFD100' : 'white'}
                    stroke="black"
                    strokeWidth={1}
                    size={15}
                />
            </button>
        </div>
    );
};

export default FavouriteButton;
