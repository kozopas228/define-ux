import React, {
    forwardRef,
    memo,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    UX_CANVAS_DIV_DEFAULT_HEIGHT,
    UX_CANVAS_DIV_DEFAULT_WIDTH,
} from '../constants';
import { toVirtualX, toVirtualY } from '../util';

const SQUARE_SIZE = 40;

const GriddedCoordsSystem = () => {
    console.log('render gridded coords system');

    let squareCountX = UX_CANVAS_DIV_DEFAULT_WIDTH / SQUARE_SIZE;
    let squareCountY = UX_CANVAS_DIV_DEFAULT_HEIGHT / SQUARE_SIZE;

    // If the number of squares is even, the grid is drawn incorrectly,
    // with the center line passing through the middle of the squares
    if (squareCountX % 2 === 1) {
        squareCountX += 1;
    }
    if (squareCountY % 2 === 1) {
        squareCountY += 1;
    }

    // Because the squares have a 1-pixel border, extra space must be allocated
    const startingSquareX = 0.5;
    const startingSquareY = 0.5;

    // Formula to center the squares, regardless of whether their count is a multiple of the field size

    let squareCountXRemainer = (UX_CANVAS_DIV_DEFAULT_WIDTH % SQUARE_SIZE) / 2;
    let squareCountYRemainer = (UX_CANVAS_DIV_DEFAULT_HEIGHT % SQUARE_SIZE) / 2;

    if ((UX_CANVAS_DIV_DEFAULT_WIDTH / SQUARE_SIZE) % 2 === 1) {
        squareCountXRemainer =
            (UX_CANVAS_DIV_DEFAULT_WIDTH % SQUARE_SIZE) / 2 + SQUARE_SIZE / 2;
    }

    if ((UX_CANVAS_DIV_DEFAULT_HEIGHT / SQUARE_SIZE) % 2 === 1) {
        squareCountYRemainer =
            (UX_CANVAS_DIV_DEFAULT_HEIGHT % SQUARE_SIZE) / 2 + +SQUARE_SIZE / 2;
    }

    const [squaresArray, setSquaresArray] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const squares: React.JSX.Element[] = [];

        for (let i = 0; i < squareCountX; i++) {
            for (let j = 0; j < squareCountY; j++) {
                const square = (
                    <rect
                        x={
                            startingSquareX -
                            squareCountXRemainer +
                            i * SQUARE_SIZE
                        }
                        y={
                            startingSquareY -
                            squareCountYRemainer +
                            j * SQUARE_SIZE
                        }
                        width={SQUARE_SIZE}
                        height={SQUARE_SIZE}
                        stroke='#E7D5B5'
                        strokeWidth='1'
                        fill='transparent'
                        key={i + ' ' + j}
                    />
                );

                squares.push(square);
            }
        }

        setSquaresArray([...squares]);
    }, [
        squareCountX,
        squareCountXRemainer,
        squareCountY,
        squareCountYRemainer,
    ]);

    const d: string = `M0 ${
        UX_CANVAS_DIV_DEFAULT_HEIGHT / 2
    }H${UX_CANVAS_DIV_DEFAULT_HEIGHT}M${UX_CANVAS_DIV_DEFAULT_WIDTH / 2} 0L${
        UX_CANVAS_DIV_DEFAULT_WIDTH / 2
    } ${UX_CANVAS_DIV_DEFAULT_WIDTH}`;

    return (
        <svg
            width={UX_CANVAS_DIV_DEFAULT_WIDTH}
            height={UX_CANVAS_DIV_DEFAULT_HEIGHT}
            style={{
                position: 'absolute',
                // centering the coordinate system
                top: toVirtualY(0) - UX_CANVAS_DIV_DEFAULT_HEIGHT / 2,
                left: toVirtualX(0) - UX_CANVAS_DIV_DEFAULT_WIDTH / 2,
            }}>
            {squaresArray.length > 0 &&
                squaresArray.map((square) => {
                    return square;
                })}
            <path
                d={d}
                stroke='black'
                strokeWidth='2'
            />
        </svg>
    );
};

GriddedCoordsSystem.displayName = 'GriddedCoordsSystem';

const memoizedComponent = memo(GriddedCoordsSystem);

export default memoizedComponent;
