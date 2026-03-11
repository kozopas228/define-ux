import React from 'react';
import {
    UX_CANVAS_WRAPPER_HEIGHT,
    UX_CANVAS_WRAPPER_WIDTH,
} from '../constants';

const AbsoluteCenter = () => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: UX_CANVAS_WRAPPER_WIDTH,
                height: UX_CANVAS_WRAPPER_HEIGHT,
                opacity: 0.3,
                zIndex: 999,
            }}>
            <svg
                width={UX_CANVAS_WRAPPER_WIDTH}
                height={UX_CANVAS_WRAPPER_HEIGHT}
                viewBox='0 0 3000 3000'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M0 1500H3000M1500 0L1500 3000'
                    stroke='#FF0000'
                    strokeWidth='40'
                />
            </svg>
        </div>
    );
};

export default AbsoluteCenter;
