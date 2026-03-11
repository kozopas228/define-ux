import { ResizingDirection } from '../types/ResizingDirection';
import { MINIMAL_SHAPE_HEIGHT, MINIMAL_SHAPE_WIDTH } from '../constants';
import React from 'react';
import { Point } from '../types/Point';
import { Shape } from '../types/Shape';
import { UUID } from '../types/Uuid';

type params = {
    e: React.MouseEvent;
    resizingPoint: Point | null;
    realMouseCoords: Point;
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    resizingDirection: ResizingDirection | null;
    setResizingDirection: React.Dispatch<
        React.SetStateAction<ResizingDirection | null>
    >;
    scale: number;
    resizingShapeId: UUID | null;
};

export function resizeShape({
    e,
    resizingPoint,
    realMouseCoords,
    setShapes,
    resizingDirection,
    setResizingDirection,
    scale,
    resizingShapeId,
}: params) {
    const diffX = e.clientX - resizingPoint!.x;
    const diffY = e.clientY - resizingPoint!.y;

    setShapes((prev) => {
        const shape = prev.find((sh) => sh.id === resizingShapeId)!;

        let newWidth = shape.width!;
        let newHeight = shape.height!;

        let newX = shape.coords.x;
        let newY = shape.coords.y;

        if (resizingDirection === ResizingDirection.right) {
            newWidth += diffX / scale;
            if (shape.coords.x > realMouseCoords.x) {
                setResizingDirection(ResizingDirection.left);
            }
        } else if (resizingDirection === ResizingDirection.left) {
            newWidth += -diffX / scale;
            newX = realMouseCoords.x;

            if (shape.coords.x + shape.width! < realMouseCoords.x) {
                setResizingDirection(ResizingDirection.right);
                newX = shape.coords.x;
            }
        } else if (resizingDirection === ResizingDirection.down) {
            newHeight += diffY / scale;

            if (shape.coords.y < realMouseCoords.y) {
                setResizingDirection(ResizingDirection.up);
            }
        } else if (resizingDirection === ResizingDirection.up) {
            newHeight -= diffY / scale;
            newY = realMouseCoords.y;

            if (shape.coords.y - shape.height! > realMouseCoords.y) {
                setResizingDirection(ResizingDirection.down);
                newY = shape.coords.y;
            }
        } else if (resizingDirection === ResizingDirection.rightDown) {
            newWidth += diffX / scale;
            newHeight += diffY / scale;

            if (
                shape.coords.x > realMouseCoords.x &&
                shape.coords.y > realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.leftDown);
            } else if (
                shape.coords.x < realMouseCoords.x &&
                shape.coords.y < realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.rightUp);
            } else if (
                shape.coords.x > realMouseCoords.x &&
                shape.coords.y < realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.leftUp);
            }
        } else if (resizingDirection === ResizingDirection.leftDown) {
            newWidth += -diffX / scale;
            newX = realMouseCoords.x;
            newHeight += diffY / scale;

            if (
                shape.coords.x + shape.width! < realMouseCoords.x &&
                shape.coords.y > realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.rightDown);
                newX = shape.coords.x;
            } else if (
                shape.coords.x + shape.width! > realMouseCoords.x &&
                shape.coords.y < realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.leftUp);
            } else if (
                shape.coords.x + shape.width! < realMouseCoords.x &&
                shape.coords.y < realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.rightUp);
            }
        } else if (resizingDirection === ResizingDirection.leftUp) {
            newWidth += -diffX / scale;
            newX = realMouseCoords.x;
            newHeight -= diffY / scale;
            newY = realMouseCoords.y;

            if (
                shape.coords.y - shape.height! > realMouseCoords.y &&
                shape.coords.x + shape.width! > realMouseCoords.x
            ) {
                setResizingDirection(ResizingDirection.leftDown);
                newY = shape.coords.y;
            } else if (
                shape.coords.x + shape.width! < realMouseCoords.x &&
                shape.coords.y >= realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.rightUp);
                newX = shape.coords.x;
            } else if (
                shape.coords.y - shape.height! > realMouseCoords.y &&
                shape.coords.x + shape.width! < realMouseCoords.x
            ) {
                setResizingDirection(ResizingDirection.rightDown);
            }
        } else if (resizingDirection === ResizingDirection.rightUp) {
            newWidth += diffX / scale;
            newHeight -= diffY / scale;
            newY = realMouseCoords.y;
            if (
                shape.coords.x > realMouseCoords.x &&
                shape.coords.y - shape.height! < realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.leftUp);
            } else if (
                shape.coords.y - shape.height! > realMouseCoords.y &&
                shape.coords.x < realMouseCoords.x
            ) {
                setResizingDirection(ResizingDirection.rightDown);
                newY = shape.coords.y;
            } else if (
                shape.coords.x > realMouseCoords.x &&
                shape.coords.y - shape.height! > realMouseCoords.y
            ) {
                setResizingDirection(ResizingDirection.leftDown);
            }
        }

        if (newWidth <= MINIMAL_SHAPE_WIDTH) {
            newWidth = MINIMAL_SHAPE_WIDTH;
            newX = shape.coords.x;
        }
        if (newHeight <= MINIMAL_SHAPE_HEIGHT) {
            newHeight = MINIMAL_SHAPE_HEIGHT;
            newY = shape.coords.y;
        }

        shape.width = newWidth;
        shape.height = newHeight;

        shape.coords.x = newX;
        shape.coords.y = newY;

        return [...prev];
    });
}
