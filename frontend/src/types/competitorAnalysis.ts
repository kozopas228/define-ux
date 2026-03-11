export interface CompetitorAnalysis {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    name: string;
    thumbnailPath?: string;
    competitors: Competitor[];
}

export interface Competitor {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    name?: string;
    order: number;
    criterias: CompetitorCriteria[];
}

export interface CompetitorCriteria {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    name?: string;
    order: number;
    type: CompetitorCriteriaTypeEnum;
    value?: string;
}

export enum CompetitorCriteriaTypeEnum {
    string = 'string',
    boolean = 'boolean',
}
