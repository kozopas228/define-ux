import React, { memo, useContext, useEffect, useState } from 'react';
import Straight from './Straight';
import { Shape } from '../../types/Shape';
import { Arrow } from '../../types/Arrow';
import { findClosestPoint, getCenterOfShape } from '../../util';
import { Point } from '../../types/Point';
import { ShapesContext } from '../../context/shapes.context';
import { ArrowsContext } from '../../context/arrows.context';
import {
    getAngleBetweenTwoPoints,
    getDistanceBetweenTwoPoints,
} from '../../../utils/math';
import { UUID } from '../../types/Uuid';

interface IProps {
    id: UUID;
    coordsStart?: Point;
    coordsFinish?: Point;
    shapeIdStart?: UUID;
    shapeIdFinish?: UUID;
}

// Size of arrow head
const HEAD_SIZE = 37;

const StraightArrow = ({
    id,
    coordsStart = { x: 0, y: 0 },
    coordsFinish = { x: 0, y: 0 },
    shapeIdStart,
    shapeIdFinish,
}: IProps) => {
    const { shapes, setShapes } = useContext(ShapesContext)!;
    const { arrows, setArrows } = useContext(ArrowsContext)!;

    const [isActive, setIsActive] = useState(false);

    if (shapeIdStart) {
        const shape = shapes.find((sh) => sh.id === shapeIdStart)!;
        coordsStart = getCenterOfShape(shape);
    }

    if (shapeIdFinish) {
        const shape = shapes.find((sh) => sh.id === shapeIdFinish)!;
        const shapeCenter = getCenterOfShape(shape);

        // Finds the closest point from the center of the first shape to the nearest place on the other
        coordsFinish = findClosestPoint(
            coordsStart,
            shapeCenter,
            shape.coords,
            shape.width!,
            shape.height!
        );
    }

    const hasFinishShape = shapeIdFinish !== undefined;

    // When component loads, set whether it's active (this is not passed in props)
    useEffect(() => {
        const currentArrowObject = arrows.find((item) => item.id === id);
        if (currentArrowObject) {
            setIsActive(currentArrowObject.isSelected);
        }
    }, [id, arrows]);

    function handleMouseDown(e: React.MouseEvent) {
        // don't prevent if wheel click
        if (e.button === 1) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        setArrows((prev: Arrow[]) => {
            const currentArrowObject = prev.find(
                (arrowObject) => arrowObject.id === id
            )!;

            prev.forEach((arrowObject) => (arrowObject.isSelected = false));

            currentArrowObject.isSelected = true;

            return [...prev];
        });

        setShapes((prev: Shape[]) => {
            prev.forEach((shapeObject) => (shapeObject.isSelected = false));

            return [...prev];
        });
    }

    const distance = getDistanceBetweenTwoPoints(coordsStart, coordsFinish);

    const angle = getAngleBetweenTwoPoints(coordsStart, coordsFinish);

    return (
        <Straight
            isActive={isActive}
            coordsStart={coordsStart}
            distance={distance}
            angle={angle}
            handleMouseDown={handleMouseDown}
            hasFinishShape={hasFinishShape}
        />
    );
};

export default memo(StraightArrow);
