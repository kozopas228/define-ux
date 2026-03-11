import {
    MAX_SCALE,
    MIN_SCALE,
    UX_CANVAS_DIV_DEFAULT_HEIGHT,
    UX_CANVAS_DIV_DEFAULT_WIDTH,
    UX_CANVAS_WRAPPER_HEIGHT,
    UX_CANVAS_WRAPPER_WIDTH,
} from '../constants';
import { DivOffsetReducerType } from '../reducers/div-offset.reducer';
import React from 'react';
import { Point } from '../types/Point';

type params = {
    e: React.WheelEvent;
    setScale: React.Dispatch<React.SetStateAction<number>>;
    realMouseCoords: Point;
    dispatchDivOffset: React.Dispatch<{
        type: DivOffsetReducerType;
        payload: any;
    }>;
};

export function scaleScroll({
    e,
    setScale,
    realMouseCoords,
    dispatchDivOffset,
}: params) {
    setScale((prev) => {
        const scaleAmount = e.deltaY * -0.0075;
        const delta = prev + scaleAmount;

        const newScale =
            Math.round(
                Math.min(Math.max(MIN_SCALE, delta), MAX_SCALE) * 100000
            ) / 100000;

        if (newScale - prev === 0) {
            return prev;
        }

        dispatchDivOffset({
            type: DivOffsetReducerType.scroll,
            payload: {
                divDefaultWidth: UX_CANVAS_DIV_DEFAULT_WIDTH,
                divDefaultHeight: UX_CANVAS_DIV_DEFAULT_HEIGHT,
                newScale,
                scaleAmount,
                realMouseCoords,
                wrapperWidth: UX_CANVAS_WRAPPER_WIDTH,
                wrapperHeight: UX_CANVAS_WRAPPER_HEIGHT,
            },
        });

        return newScale;
    });
}
