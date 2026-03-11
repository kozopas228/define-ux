import { Point } from '../types/Point';

export enum DivOffsetReducerType {
    move,
    scroll,
    keyboardScale,
}

export function divOffsetReducer(
    prevPoint: Point,
    action: {
        type: DivOffsetReducerType;
        payload: any;
    }
): Point {
    switch (action.type) {
        case DivOffsetReducerType.move: {
            const {
                divDefaultWidth,
                divDefaultHeight,
                scale,
                diffX,
                diffY,
                wrapperWidth,
                wrapperHeight,
            } = action.payload;

            const newPoint: Point = { x: 0, y: 0 };

            const scaleOffsetX =
                (divDefaultWidth * scale - divDefaultWidth) / 2;


            // check if out of bounds
            if (prevPoint.x + diffX > scaleOffsetX) {
                newPoint.x = scaleOffsetX;
            } else if (
                prevPoint.x + diffX <
                wrapperWidth - divDefaultWidth - scaleOffsetX
            ) {
                newPoint.x = wrapperWidth - divDefaultWidth - scaleOffsetX;
            } else {
                newPoint.x = prevPoint.x + diffX;
            }

            const scaleOffsetY =
                (divDefaultHeight * scale - divDefaultHeight) / 2;

            if (prevPoint.y + diffY > scaleOffsetY) {
                newPoint.y = scaleOffsetY;
            } else if (
                prevPoint.y + diffY <
                wrapperHeight - divDefaultHeight - scaleOffsetY
            ) {
                newPoint.y = wrapperHeight - divDefaultHeight - scaleOffsetY;
            } else {
                newPoint.y = prevPoint.y + diffY;
            }

            return newPoint;
        }
        case DivOffsetReducerType.scroll: {
            const {
                divDefaultWidth,
                divDefaultHeight,
                newScale,
                scaleAmount,
                realMouseCoords,
                wrapperWidth,
                wrapperHeight,
            } = action.payload;

            const newPoint: Point = { x: 0, y: 0 };
            // check if out of bounds, if yes - change offset
            // scale offset
            const scaleOffsetX =
                (divDefaultWidth * newScale - divDefaultWidth) / 2;

            const newOffsetX = prevPoint.x - realMouseCoords.x * scaleAmount;
            // left side
            if (newOffsetX > scaleOffsetX) {
                newPoint.x = scaleOffsetX;
                // right side
            } else if (
                newOffsetX <
                wrapperWidth - divDefaultWidth - scaleOffsetX
            ) {
                newPoint.x = wrapperWidth - divDefaultWidth - scaleOffsetX;
            } else {
                // if offset is within bounds
                newPoint.x = newOffsetX;
            }

            // scale offset
            const scaleOffsetY =
                (divDefaultHeight * newScale - divDefaultHeight) / 2;

            const newOffsetY = prevPoint.y + realMouseCoords.y * scaleAmount;
            // top side
            if (newOffsetY > scaleOffsetY) {
                newPoint.y = scaleOffsetY;
                // bottom side
            } else if (
                newOffsetY <
                wrapperHeight - divDefaultHeight - scaleOffsetY
            ) {
                newPoint.y = wrapperHeight - divDefaultHeight - scaleOffsetY;
            } else {
                // if offset is within bounds
                newPoint.y = newOffsetY;
            }

            return newPoint;
        }
        case DivOffsetReducerType.keyboardScale: {
            const {
                divDefaultWidth,
                divDefaultHeight,
                newScale,
                scaleAmount,
                realWrapperCenterCoords,
                wrapperWidth,
                wrapperHeight,
            } = action.payload;
            const newPoint = { x: 0, y: 0 };

            // check if out of bounds, if yes - change offset
            // scale offset
            const scaleOffsetX =
                (divDefaultWidth * newScale - divDefaultWidth) / 2;

            const newOffsetX =
                prevPoint.x - realWrapperCenterCoords.x * scaleAmount;
            // left side
            if (newOffsetX > scaleOffsetX) {
                newPoint.x = scaleOffsetX;
                // right side
            } else if (
                newOffsetX <
                wrapperWidth - divDefaultWidth - scaleOffsetX
            ) {
                newPoint.x = wrapperWidth - divDefaultWidth - scaleOffsetX;
            } else {
                // if offset is within bounds
                newPoint.x = newOffsetX;
            }

            // scale offset
            const scaleOffsetY =
                (divDefaultHeight * newScale - divDefaultHeight) / 2;

            const newOffsetY =
                prevPoint.y + realWrapperCenterCoords.y * scaleAmount;
            // top side
            if (newOffsetY > scaleOffsetY) {
                newPoint.y = scaleOffsetY;
                // bottom side
            } else if (
                newOffsetY <
                wrapperHeight - divDefaultHeight - scaleOffsetY
            ) {
                newPoint.y = wrapperHeight - divDefaultHeight - scaleOffsetY;
            } else {
                // if offset is within bounds
                newPoint.y = newOffsetY;
            }

            return newPoint;
        }
    }
}
