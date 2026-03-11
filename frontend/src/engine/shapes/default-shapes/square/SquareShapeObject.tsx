import React from 'react';
import SquareShape from './SquareShape';
import { Shape, shapeProperties } from '../../../types/Shape';

export class SquareShapeObject extends Shape {
    constructor(properties: shapeProperties) {
        if (!properties.width) {
            properties.width = 300;
        }

        if (!properties.height) {
            properties.height = 300;
        }

        super(properties);
    }
    public component(): React.JSX.Element {
        return (
            <SquareShape
                id={this.id}
                key={this.id}
                coords={this.coords}
                width={this.width!}
                height={this.height!}
                text={this.text}
            />
        );
    }
}
