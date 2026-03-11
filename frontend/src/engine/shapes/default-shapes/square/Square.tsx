import React, { useState } from 'react';
import { getRandomInteger } from '../../../../utils/math';

const colors = [
    { background: '#85B3C1', border: '#294851' },
    { background: '#cfe0c3', border: '#304323' },
    { background: '#ffeed6', border: '#8f5300' },
    { background: '#f2ced5', border: '#a12b43' },
    { background: '#d6deff', border: '#002de0' },
    { background: '#f5ccb7', border: '#a24516' },
    { background: '#e5f0e7', border: '#25412a' },
    { background: '#ede8e8', border: '#040303' },
];

const Square = () => {
    const [color, _] = useState(colors[getRandomInteger(0, colors.length)]);

    return (
        <div
            style={{
                boxSizing: 'border-box',
                backgroundColor: color.background,
                border: `3px solid ${color.border}`,
                width: '100%',
                height: '100%',
            }}></div>
    );
};

export default Square;
