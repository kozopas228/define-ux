import { LinkType } from './LinkType';

export class Link {
    public id: number;
    public text: string;
    public type: LinkType;

    constructor(id: number, text: string, type: LinkType) {
        this.id = id;
        this.text = text;
        this.type = type;
    }
}
