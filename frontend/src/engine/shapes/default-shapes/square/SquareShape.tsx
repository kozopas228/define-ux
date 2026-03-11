import React, { memo } from 'react';
import Square from './Square';
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

const SquareShape = ({ id, coords, width, height, text }: IProps) => {
    return (
        <ShapeComponent
            id={id}
            coords={coords}
            width={width}
            height={height}
            text={text}>
            <Square />
        </ShapeComponent>
    );
};

export default memo(SquareShape);
