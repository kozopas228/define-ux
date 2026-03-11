export interface EmpathyMap {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    name: string;
    thumbnailPath?: string;
    says?: string;
    does?: string;
    thinks?: string;
    feels?: string;
    pains?: string;
    gains?: string;
    personaSK?: string;
}
