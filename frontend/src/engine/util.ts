import { Shape } from './types/Shape';
import {
    UX_CANVAS_DIV_DEFAULT_OFFSET_X,
    UX_CANVAS_DIV_DEFAULT_OFFSET_Y,
} from './constants';
import { Point } from './types/Point';
import { EmptyShapeObject } from './shapes/default-shapes/empty/EmptyShapeObject';
import { connectRectangles } from 'diagram-js/lib/layout/ManhattanLayout';
import { v4 } from 'uuid';
import { UUID } from './types/Uuid';
import _ from 'lodash';

export function toRealX(x: number): number {
    return x - UX_CANVAS_DIV_DEFAULT_OFFSET_X;
}
export function toRealY(y: number): number {
    return UX_CANVAS_DIV_DEFAULT_OFFSET_Y - y;
}
export function toVirtualX(x: number): number {
    return x + UX_CANVAS_DIV_DEFAULT_OFFSET_X;
}
export function toVirtualY(y: number): number {
    return UX_CANVAS_DIV_DEFAULT_OFFSET_Y - y;
}

export function roundToGridSize(n: number, gridSize: number) {
    const int = Math.floor(n);
    const remainder = int % gridSize;

    if (remainder >= gridSize / 2) {
        return int + gridSize - remainder;
    }

    return int - remainder;
}

export function findClosestPoint(
    firstCenter: Point,
    secondCenter: Point,
    secondCoords: Point,
    secondWidth: number,
    secondHeight: number
) {
    // Find the vector pointing from the center of the first shape to the center of the second
    const vectorX = secondCenter.x - firstCenter.x;
    const vectorY = secondCenter.y - firstCenter.y;

    // Normalize the vector
    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    const normalizedVectorX = vectorX / length;
    const normalizedVectorY = vectorY / length;

    // Find the vector from the center of the second shape to its edge
    const edgeVectorX = normalizedVectorX * (secondWidth / 2);
    const edgeVectorY = normalizedVectorY * (secondHeight / 2);

    // Find the coordinates of the closest point
    const closestPointX = secondCenter.x - edgeVectorX;
    const closestPointY = secondCenter.y - edgeVectorY;

    return { x: closestPointX, y: closestPointY };
}

export function calculatePercentageFromAngle(angle: number) {
    // Convert the angle in degrees to the range from 0 to 180 degrees
    angle = (angle + 180) % 360; // Ensure the angle is from -180 to 180

    // Calculate the percentage based on the distance to the nearest axis
    let percentage = 0;

    if (angle >= 0 && angle <= 45) {
        percentage = (angle / 45) * 100;
    } else if (angle > 45 && angle <= 90) {
        percentage = ((90 - angle) / 45) * 100;
    } else if (angle > 90 && angle <= 135) {
        percentage = ((angle - 90) / 45) * 100;
    } else if (angle > 135 && angle <= 180) {
        percentage = ((180 - angle) / 45) * 100;
    } else if (angle > 180 && angle <= 225) {
        percentage = ((angle - 180) / 45) * 100;
    } else if (angle > 225 && angle <= 270) {
        percentage = ((270 - angle) / 45) * 100;
    } else if (angle > 270 && angle <= 315) {
        percentage = ((angle - 270) / 45) * 100;
    } else if (angle > 315 && angle <= 360) {
        percentage = ((360 - angle) / 45) * 100;
    }

    return percentage;
}

export function getCenterOfShape(shape: Shape): Point {
    return {
        x: shape.coords.x + shape.width! / 2,
        y: shape.coords.y - shape.height! / 2,
    };
}

export function isShapeInsideSelectingArea(
    shape: Shape,
    areaStartingPoint: Point,
    areaEndingPoint: Point
): boolean {
    // x1 < x2, y1 > y2 - normal direction (from top-left to bottom-right)
    // If the direction is not as described above, change it to match
    if (areaStartingPoint.x > areaEndingPoint.x) {
        const temp = areaStartingPoint.x;
        areaStartingPoint.x = areaEndingPoint.x;
        areaEndingPoint.x = temp;
    }
    if (areaStartingPoint.y < areaEndingPoint.y) {
        const temp = areaStartingPoint.y;
        areaStartingPoint.y = areaEndingPoint.y;
        areaEndingPoint.y = temp;
    }

    return (
        areaEndingPoint.x >= shape.coords.x &&
        areaEndingPoint.y <= shape.coords.y &&
        areaStartingPoint.x <= shape.coords.x + shape.width! &&
        areaStartingPoint.y >= shape.coords.y - shape.height!
    );
}

// Function to create a broken path between two shapes
export function createBrokenPath(
    coordsStart: Point,
    coordsFinish: Point,
    shapeStart: Shape = new EmptyShapeObject(),
    shapeFinish: Shape = new EmptyShapeObject()
): Point[] {
    const source = {
        width: shapeStart.width!,
        height: shapeStart.height!,
        x: shapeStart.coords.x,
        y: shapeStart.coords.y - shapeStart.height!,
    };

    if (shapeFinish instanceof EmptyShapeObject) {
        shapeFinish.coords = coordsFinish;
    }

    const target = {
        width: shapeFinish.width!,
        height: shapeFinish.height!,
        x: shapeFinish.coords.x,
        y: shapeFinish.coords.y - shapeFinish.height!,
    };

    const result = connectRectangles(
        source,
        target,
        getCenterOfShape(shapeStart),
        getCenterOfShape(shapeFinish)
    );

    return [...result];
}

export function generateUUID(): UUID {
    return v4() as UUID;
}

export function cloneShapes(...shapes: Shape[]): Shape[] {
    const clonedShapes = _.cloneDeep(shapes);

    clonedShapes.forEach((shape) => {
        shape.id = generateUUID();
    });

    return clonedShapes;
}
