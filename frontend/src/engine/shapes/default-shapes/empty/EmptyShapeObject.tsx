import React from 'react';
import { Shape } from '../../../types/Shape';
import { NIL } from 'uuid';
import { UUID } from '../../../types/Uuid';

// This class is used only when creating arrows, when the arrow
// doesn't have a finish shape yet, this class is assigned as the finish shape
// (or more precisely its object)
export class EmptyShapeObject extends Shape {
    constructor() {
        super({
            id: NIL as UUID,
            coords: { x: 0, y: 0 },
        });

        this.height = 0;
        this.width = 0;
    }
    component(): React.JSX.Element {
        return <></>;
    }
}
