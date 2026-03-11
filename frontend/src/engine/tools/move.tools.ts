import React from 'react';
import { DivOffsetReducerType } from '../reducers/div-offset.reducer';
import {
    UX_CANVAS_DIV_DEFAULT_HEIGHT,
    UX_CANVAS_DIV_DEFAULT_WIDTH,
    UX_CANVAS_WRAPPER_HEIGHT,
    UX_CANVAS_WRAPPER_WIDTH,
} from '../constants';
import { Point } from '../types/Point';

type params = {
    e: React.MouseEvent;
    movingPoint: Point;
    scale: number;
    dispatchDivOffset: React.Dispatch<{
        type: DivOffsetReducerType;
        payload: any;
    }>;
};

export function moveCanvas({
    e,
    movingPoint,
    dispatchDivOffset,
    scale,
}: params) {
    // We move the difference itself, we don't need exact coordinates, so clientX and clientY are sufficient,
    // even though they don't show the exact location of the object

    // Difference from the starting point when moving the infiniteDiv
    const diffX = e.clientX - movingPoint.x;
    const diffY = e.clientY - movingPoint.y;

    dispatchDivOffset({
        type: DivOffsetReducerType.move,
        payload: {
            divDefaultWidth: UX_CANVAS_DIV_DEFAULT_WIDTH,
            divDefaultHeight: UX_CANVAS_DIV_DEFAULT_HEIGHT,
            scale,
            diffX,
            diffY,
            wrapperWidth: UX_CANVAS_WRAPPER_WIDTH,
            wrapperHeight: UX_CANVAS_WRAPPER_HEIGHT,
        },
    });
}
