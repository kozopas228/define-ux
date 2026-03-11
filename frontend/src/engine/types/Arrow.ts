import React from 'react';
import { Point } from './Point';
import { UUID } from './Uuid';

export abstract class Arrow {
    public id: UUID;
    public isSelected: boolean = false;
    public coordsStart?: Point;
    public coordsFinish?: Point;
    public shapeIdStart?: UUID;
    public shapeIdFinish?: UUID;

    protected constructor({
        id,
        coordsStart,
        coordsFinish,
        shapeIdStart,
        shapeIdFinish,
    }: arrowProperties) {
        this.id = id;
        this.coordsStart = coordsStart;
        this.coordsFinish = coordsFinish;
        this.shapeIdStart = shapeIdStart;
        this.shapeIdFinish = shapeIdFinish;
    }

    abstract component(): React.JSX.Element;
}

export type arrowProperties = {
    id: UUID;
    coordsStart?: Point;
    coordsFinish?: Point;
    shapeIdStart?: UUID;
    shapeIdFinish?: UUID;
};
