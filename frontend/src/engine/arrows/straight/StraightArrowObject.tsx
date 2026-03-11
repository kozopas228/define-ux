import { Arrow, arrowProperties } from '../../types/Arrow';
import React from 'react';
import StraightArrow from './StraightArrow';

export class StraightArrowObject extends Arrow {
    constructor(properties: arrowProperties) {
        super(properties);
    }
    component(): React.JSX.Element {
        return (
            <StraightArrow
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
