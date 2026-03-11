import { Arrow, arrowProperties } from '../../types/Arrow';
import React from 'react';
import BrokenArrow from './BrokenArrow';
import { Point } from '../../types/Point';

export class BrokenArrowObject extends Arrow {
    constructor(properties: arrowProperties) {
        super(properties);
    }
    component(): React.JSX.Element {
        return (
            <BrokenArrow
                id={this.id}
                key={this.id}
                coordsStart={this.coordsStart}
                coordsFinish={this.coordsFinish}
                shapeIdStart={this.shapeIdStart}
                shapeIdFinish={this.shapeIdFinish}
            />
        );
    }
}
