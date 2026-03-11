import React, { memo, useContext, useEffect, useState } from 'react';
import { Shape } from '../../types/Shape';
import { Arrow } from '../../types/Arrow';
import BrokenPart from './BrokenPart';
import { createBrokenPath, getCenterOfShape } from '../../util';
import { Point } from '../../types/Point';
import { ShapesContext } from '../../context/shapes.context';
import { ArrowsContext } from '../../context/arrows.context';
import { UUID } from '../../types/Uuid';

interface IProps {
    id: UUID;
    coordsStart?: Point;
    coordsFinish?: Point;
    shapeIdStart?: UUID;
    shapeIdFinish?: UUID;
}

const BrokenArrow = ({
    id,
    coordsStart = { x: 0, y: 0 },
    coordsFinish = { x: 0, y: 0 },
    shapeIdStart,
    shapeIdFinish,
}: IProps) => {
    const { shapes, setShapes } = useContext(ShapesContext)!;
    const { arrows, setArrows } = useContext(ArrowsContext)!;

    const [isActive, setIsActive] = useState(false);

    let shapeStart: Shape | undefined = undefined;
    let shapeFinish: Shape | undefined = undefined;

    if (shapeIdStart) {
        const shape = shapes.find((sh) => sh.id === shapeIdStart)!;
        shapeStart = shape;

        coordsStart = getCenterOfShape(shape);
    }

    if (shapeIdFinish) {
        const shape = shapes.find((sh) => sh.id === shapeIdFinish)!;
        shapeFinish = shape;

        coordsFinish = getCenterOfShape(shape);
    }

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

    // When component loads, set whether it's active (this is not passed in props)
    useEffect(() => {
        const currentArrowObject = arrows.find((item) => item.id === id);
        if (currentArrowObject) {
            setIsActive(currentArrowObject.isSelected);
        }
    }, [id, arrows]);

    const path = createBrokenPath(
        coordsStart,
        coordsFinish,
        shapeStart,
        shapeFinish
    );

    // all the following code, including BrokenPart component,
    // to make the broken line look as needed

    const pathJsx = [];

    for (let i = 0; i < path.length - 1; i++) {
        let deg: number;
        let width: number;

        if (path[i].x < path[i + 1].x) {
            deg = 0;
            width = path[i + 1].x - path[i].x;
        } else if (path[i].x > path[i + 1].x) {
            deg = 180;
            width = path[i].x - path[i + 1].x;
        } else if (path[i].y < path[i + 1].y) {
            deg = 270;
            width = path[i + 1].y - path[i].y;
        } else {
            deg = 90;
            width = path[i].y - path[i + 1].y;
        }

        const hasFinishShape = shapeIdFinish !== undefined;

        pathJsx.push(
            <BrokenPart
                key={i}
                isActive={isActive}
                coords={path[i]}
                width={width}
                angle={deg}
                handleMouseDown={handleMouseDown}
                hasFinishShape={hasFinishShape}
            />
        );
    }

    return pathJsx;
};

export default memo(BrokenArrow);
