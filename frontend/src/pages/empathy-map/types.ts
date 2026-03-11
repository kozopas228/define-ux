export enum EmpathyPartType {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
}

export interface EmpathyMapDto {
    projectSK: string;
    empathyMapSK: string;
    name: string;
    says?: string;
    does?: string;
    thinks?: string;
    feels?: string;
    pains?: string;
    gains?: string;
    personaSK?: string;
}
