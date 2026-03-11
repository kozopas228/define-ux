import React, { memo, useContext, useEffect, useState } from 'react';
import { Shape } from './types/Shape';
import { Point } from './types/Point';
import { isShapeInsideSelectingArea, toRealX, toRealY } from './util';
import { RefsContext } from './context/refs.context';
import { ShapesContext } from './context/shapes.context';

interface IProps {
    startingPoint: Point;
    endingPoint: Point;
    scale: number;
}

const mouseFixedOffset = 2;

const SelectArea = ({ startingPoint, endingPoint, scale }: IProps) => {
    console.log('rendering select area');

    const { divRef, wrapperRef } = useContext(RefsContext)!;
    const { shapes, setShapes } = useContext(ShapesContext)!;

    const wrapperElement = wrapperRef.current!;
    const wrapperBoundingClientRect = wrapperElement.getBoundingClientRect();

    const [lastEndingPoint, setLastEndingPoint] = useState(endingPoint);

    // Coordinates relative to wrapper
    const relWrapperStartingX =
        startingPoint.x - wrapperBoundingClientRect.left - mouseFixedOffset;
    const relWrapperStartingY =
        startingPoint.y - wrapperBoundingClientRect.top - mouseFixedOffset;

    const relWrapperEndingX =
        endingPoint.x - wrapperBoundingClientRect.left - mouseFixedOffset;
    const relWrapperEndingY =
        endingPoint.y - wrapperBoundingClientRect.top - mouseFixedOffset;

    const width = relWrapperEndingX - relWrapperStartingX;
    const height = relWrapperEndingY - relWrapperStartingY;

    const positionStyles = {
        left: 0,
        top: 0,
    };

    if (width > 0) {
        positionStyles.left = relWrapperStartingX;
    }

    if (height > 0) {
        positionStyles.top = relWrapperStartingY;
    }

    if (width < 0) {
        positionStyles.left = relWrapperEndingX;
    }

    if (height < 0) {
        positionStyles.top = relWrapperEndingY;
    }

    useEffect(() => {
        // prevent unnecessary re-rendering
        if (
            endingPoint.x === lastEndingPoint.x &&
            endingPoint.y === lastEndingPoint.y
        ) {
            return;
        }
        const idbcr = divRef.current?.getBoundingClientRect();

        if (idbcr) {
            // Coordinates relative to top-left corner (virtual coordinates)
            const virtualStartingX = Math.round(
                (startingPoint.x - idbcr.left) / scale
            );
            const virtualStartingY = Math.round(
                (startingPoint.y - idbcr.top) / scale
            );

            const virtualEndingX = Math.round(
                (endingPoint.x - idbcr.left) / scale
            );
            const virtualEndingY = Math.round(
                (endingPoint.y - idbcr.top) / scale
            );

            const realStartingPoint: Point = {
                x: toRealX(virtualStartingX),
                y: toRealY(virtualStartingY),
            };
            const realEndingPoint: Point = {
                x: toRealX(virtualEndingX),
                y: toRealY(virtualEndingY),
            };

            const shapesInSelectArea = shapes.filter((shapeObject) =>
                isShapeInsideSelectingArea(
                    shapeObject,
                    realStartingPoint,
                    realEndingPoint
                )
            );

            console.log(shapesInSelectArea.length);
            if (shapesInSelectArea.length > 0) {
                setShapes((prev: Shape[]) => {
                    for (const shapeObject of prev) {
                        shapeObject.isSelected = isShapeInsideSelectingArea(
                            shapeObject,
                            realStartingPoint,
                            realEndingPoint
                        );
                    }

                    return [...prev];
                });
            } else {
                // prevent unnecessary re-rendering
                if (shapes.find((shape) => shape.isSelected) !== undefined) {
                    setShapes((prev: Shape[]) => {
                        for (const shapeObject of prev) {
                            shapeObject.isSelected = false;
                        }

                        return [...prev];
                    });
                }
            }
        }

        return () => {
            setLastEndingPoint(endingPoint);
        };
    }, [
        endingPoint,
        endingPoint.x,
        endingPoint.y,
        divRef,
        lastEndingPoint.x,
        lastEndingPoint.y,
        scale,
        setShapes,
        // shapes,
        startingPoint.x,
        startingPoint.y,
        toRealX,
        toRealY,
    ]);

    return (
        width !== 0 &&
        height !== 0 && (
            <div
                style={{
                    position: 'absolute',
                    width: Math.abs(width),
                    height: Math.abs(height),
                    ...positionStyles,
                    border: '1px solid rgba(105,154,253,0.8)',
                    backgroundColor: 'rgba(105,154,253,0.4)',
                    // backgroundImage:
                    //     // eslint-disable-next-line max-len
                    //     `url("${fotka}")`,
                    zIndex: 99999,
                }}></div>
        )
    );
};

export default memo(SelectArea);
