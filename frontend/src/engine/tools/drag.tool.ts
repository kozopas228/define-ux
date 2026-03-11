import React from 'react';
import { Point } from '../types/Point';
import { Shape } from '../types/Shape';

type params = {
    e: React.MouseEvent;
    draggingPoint: Point | null;
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    scale: number;
};

export function dragShape({ e, draggingPoint, setShapes, scale }: params) {
    const diffX = (e.clientX - draggingPoint!.x) / scale;
    const diffY = (draggingPoint!.y - e.clientY) / scale;

    setShapes((prev) => {
        prev.forEach((shape) => {
            if (shape.isSelected) {
                shape.coords = {
                    x: shape.coords.x + diffX,
                    y: shape.coords.y + diffY,
                };
            }
        });

        return [...prev];
    });
}
