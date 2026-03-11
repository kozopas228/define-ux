import { Point } from './Point';
import { ArbitraryObject } from './ArbitraryObject';
import { UUID } from './Uuid';

export abstract class Shape extends ArbitraryObject {
    public width?: number;
    public height?: number;
    public text?: string;
    public isSelected: boolean = false;
    public isEditing: boolean = false;

    protected constructor({
        id,
        coords,
        text,
        width,
        height,
    }: shapeProperties) {
        super(id, coords);
        this.text = text;
        this.width = width;
        this.height = height;
    }
}

export type shapeProperties = {
    id: UUID;
    coords: Point;
    text?: string;
    width?: number;
    height?: number;
};
