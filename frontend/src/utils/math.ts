import { Point } from '../engine/types/Point';

export function getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}
export function getAngleBetweenTwoPoints(
    coordsStart: Point,
    coordsFinish: Point
): number {
    // The angle between points (in radians) is measured using
    // the arctangent of the ratio of y change to x change
    const angleInRadians = Math.atan2(
        coordsStart.y - coordsFinish.y,
        coordsFinish.x - coordsStart.x
    );

    return convertRadiansToDegrees(angleInRadians);
}
export function convertRadiansToDegrees(rad: number): number {
    // Convert radians to degrees
    return rad * (180 / Math.PI);
}

export function getDistanceBetweenTwoPoints(
    coordsStart: Point,
    coordsFinish: Point
): number {
    // Distance between two points is calculated using
    // the Pythagorean theorem:
    return Math.sqrt(
        Math.pow(coordsFinish.x - coordsStart.x, 2) +
            Math.pow(coordsFinish.y - coordsStart.y, 2)
    );
}
