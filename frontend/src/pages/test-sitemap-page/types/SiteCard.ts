import { Link } from './Link';

export class SiteCard {
    public id: number;
    public heading: string;
    public links: Link[];
    public coords: { x: number; y: number };

    constructor(
        id: number,
        heading: string,
        links: Link[],
        coords: { x: number; y: number }
    ) {
        this.id = id;
        this.heading = heading;
        this.links = links;
        this.coords = coords;
    }
}
