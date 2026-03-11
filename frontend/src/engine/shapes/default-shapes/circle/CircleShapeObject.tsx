import React from 'react';
import { Shape, shapeProperties } from '../../../types/Shape';
import CircleShape from './CircleShape';

export class CircleShapeObject extends Shape {
    constructor(properties: shapeProperties) {
        if (!properties.width) {
            properties.width = 150;
        }

        if (!properties.height) {
            properties.height = 150;
        }

        super(properties);
    }
    public component(): React.JSX.Element {
        return (
            <CircleShape
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
