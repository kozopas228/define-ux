import React, { memo } from 'react';
import Circle from './Circle';
import { Point } from '../../../types/Point';
import ShapeComponent from '../../ShapeComponent';
import { UUID } from '../../../types/Uuid';

interface IProps {
    id: UUID;
    coords: Point;
    width: number;
    height: number;
    text?: string;
}

const CircleShape = ({ id, coords, width, height, text }: IProps) => {
    return (
        <ShapeComponent
            id={id}
            coords={coords}
            height={height}
            width={width}
            text={text}>
            <Circle />
        </ShapeComponent>
    );
};

export default memo(CircleShape);
