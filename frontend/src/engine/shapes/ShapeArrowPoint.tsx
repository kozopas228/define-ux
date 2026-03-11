import React, { useContext } from 'react';
import { ArrowsContext } from '../context/arrows.context';
import { LEFT_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON } from '../constants';
import { ArrowType } from '../types/ArrowType';
import { UUID } from '../types/Uuid';

interface IProps {
    width: number;
    height: number;
    shapeId: UUID;
}

// Size of the point itself
const pointSize = 30;
// Size of the full box for the point, because the point itself can be quite small
const boxSize = 75;

const ShapeArrowPoint = ({ width, height, shapeId }: IProps) => {
    const { setIsArrowing, setArrowingStartShapeId, setArrowType } =
        useContext(ArrowsContext)!;

    function mouseDownHandler(e: React.MouseEvent) {
        e.stopPropagation();
        setIsArrowing(true);
        setArrowingStartShapeId(shapeId);
        if (e.button === LEFT_MOUSE_BUTTON) {
            setArrowType(ArrowType.straight);
        } else if (e.button === RIGHT_MOUSE_BUTTON) {
            setArrowType(ArrowType.broken);
        }
    }

    const top = height / 2 - boxSize / 2;
    const left = width / 2 - boxSize / 2;

    return (
        <div
            style={{
                position: 'absolute',
                top,
                left,
                backgroundColor: 'rgba(119, 91, 89, 0.2)',
                width: boxSize,
                height: boxSize,
                border: '1px solid rgba(119, 91, 89, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={mouseDownHandler}>
            <div
                style={{
                    width: pointSize,
                    height: pointSize,
                    backgroundColor: 'olive',
                    border: '1px solid black',
                    borderRadius: '50%',
                }}></div>
        </div>
    );
};

export default ShapeArrowPoint;
