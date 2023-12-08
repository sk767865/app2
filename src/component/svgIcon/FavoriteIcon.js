import React from 'react';
import Svg, { Path } from 'react-native-svg';

const FavoriteIcon = ({ favorite }) => (
    <Svg
        width={30}
        height={30}
        viewBox="0 0 24 24"
        fill="none"
        stroke={favorite ? 'red' : 'grey'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill={favorite ? 'red' : 'grey'}
        />
    </Svg>
);

export default FavoriteIcon;
