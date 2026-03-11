import { Arrow } from '../types/Arrow';
import { ArrowType } from '../types/ArrowType';
import { StraightArrowObject } from '../arrows/straight/StraightArrowObject';
import { BrokenArrowObject } from '../arrows/broken/BrokenArrowObject';
import React from 'react';
import { Point } from '../types/Point';
import { UUID } from '../types/Uuid';
import { generateUUID } from '../util';

type params = {
    currentArrow: Arrow | null;
    arrows: Arrow[];
    realMouseCoords: Point;
    arrowType: ArrowType | null;
    arrowingStartPoint: Point | null;
    arrowingFinishPoint: Point | null;
    arrowingStartShapeId: UUID | null;
    arrowingFinishShapeId: UUID | null;
    setArrows: React.Dispatch<React.SetStateAction<Arrow[]>>;
    setCurrentArrow: React.Dispatch<React.SetStateAction<Arrow | null>>;
    setArrowingFinishPoint: React.Dispatch<React.SetStateAction<Point | null>>;
};

export function makeArrow({
    currentArrow,
    arrows,
    realMouseCoords,
    arrowType,
    arrowingStartPoint,
    arrowingFinishPoint,
    arrowingStartShapeId,
    arrowingFinishShapeId,
    setArrows,
    setCurrentArrow,
    setArrowingFinishPoint,
}: params) {
    if (!currentArrow) {
        const id = generateUUID();

        let newArrow: Arrow;

        if (arrowType === ArrowType.straight) {
            newArrow = new StraightArrowObject({
                id,
                coordsStart: arrowingStartPoint ?? { x: 0, y: 0 },
                coordsFinish: arrowingFinishPoint ?? realMouseCoords,
                shapeIdStart: arrowingStartShapeId ?? undefined,
                shapeIdFinish: arrowingFinishShapeId ?? undefined,
            });
        } else if (arrowType === ArrowType.broken) {
            newArrow = new BrokenArrowObject({
                id,
                coordsStart: arrowingStartPoint ?? { x: 0, y: 0 },
                coordsFinish: arrowingFinishPoint ?? realMouseCoords,
                shapeIdStart: arrowingStartShapeId ?? undefined,
                shapeIdFinish: arrowingFinishShapeId ?? undefined,
            });
        }

        setArrows((prev) => [...prev, newArrow]);
        setCurrentArrow(newArrow!);

        setArrowingFinishPoint({ x: realMouseCoords.x, y: realMouseCoords.y });
    } else {
        if (arrowingFinishShapeId) {
            if (arrowType === ArrowType.straight) {
                setArrows((prev) => {
                    const arrow = prev.find((a) => a.id === currentArrow.id)!;
                    arrow.shapeIdFinish = arrowingFinishShapeId;
                    return [...prev];
                });
            } else if (arrowType === ArrowType.broken) {
                setArrows((prev) => {
                    const arrow = prev.find((a) => a.id === currentArrow.id)!;
                    arrow.shapeIdFinish = arrowingFinishShapeId;
                    return [...prev];
                });
            }
        } else {
            setArrowingFinishPoint({
                x: realMouseCoords.x,
                y: realMouseCoords.y,
            });

            setArrows((prev) => {
                const arrow = prev.find((a) => a.id === currentArrow.id)!;
                arrow.coordsFinish = realMouseCoords;
                arrow.shapeIdFinish = undefined;
                return [...prev];
            });
        }
    }
}
