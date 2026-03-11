import { UUID } from '../../types/uuid';

export interface CompetitorAnalysisResponseDto {
    projectSK: string;
    competitorAnalysisSK: string;
    name: string;
    competitors: CompetitorResponseDto[];
}

export interface CompetitorResponseDto {
    id: UUID;
    name: string;
    criterias: CriteriaResponseDto[];
}

export interface CriteriaResponseDto {
    id: UUID;
    name: string;
    type: 'string' | 'boolean';
    value?: CriteriaValueResponseDto;
}

export interface CriteriaValueResponseDto {
    id: UUID;
    value: string | boolean;
}
