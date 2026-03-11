import React from 'react';
import { Point } from './Point';
import { UUID } from './Uuid';

export abstract class ArbitraryObject {
    public id: UUID;
    public coords: Point;

    protected constructor(id: UUID, coords: Point) {
        this.id = id;
        this.coords = coords;
    }

    abstract component(): React.JSX.Element;
}
