import { Shape, shapeProperties } from './types/Shape';
import { Arrow } from './types/Arrow';
import { ArbitraryObject } from './types/ArbitraryObject';
import { Point } from './types/Point';
import { generateUUID } from './util';

export class UxEditor {
    private shapes: Shape[];
    private arrows: Arrow[];
    private arbitraries: ArbitraryObject[];
    constructor() {
        this.shapes = [];
        this.arrows = [];
        this.arbitraries = [];
    }

    public getAllShapes(): Shape[] {
        return this.shapes;
    }
    public addShape(...shapes: Shape[]) {
        this.shapes.push(...shapes);
    }
    public createNewShape<T extends Shape>(
        cl: new (properties: shapeProperties) => T,
        coords?: Point
    ): void {
        const newId = generateUUID();
        const newCoords = coords ?? { x: 0, y: 0 };

        this.addShape(new cl({ id: newId, coords: newCoords }));
    }
    public removeAllShapes(): void {
        this.shapes = [];
    }

    public getAllArrows(): Arrow[] {
        return this.arrows;
    }
    public addArrow(...arrows: Arrow[]) {
        this.arrows.push(...arrows);
    }
    public removeAllArrows(): void {
        this.arrows = [];
    }

    public getAllArbitraries(): ArbitraryObject[] {
        return this.arbitraries;
    }

    public addArbitrary(...arbitraries: ArbitraryObject[]) {
        this.arbitraries.push(...arbitraries);
    }

    public removeAllArbitraries(): void {
        this.arbitraries = [];
    }
}
