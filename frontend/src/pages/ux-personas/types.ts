import { UUID } from '../../types/uuid';

export interface UxPersonaDto {
    projectSK: string;
    uxPersonaSK: string;
    name: string;
    personality?: string;
    hasPersonality: boolean;
    demographics_age?: number;
    demographics_gender?: string;
    demographics_occupation?: string;
    hasDemographics_occupation: boolean;
    demographics_income?: string;
    hasDemographics_income: boolean;
    demographics_location?: string;
    hasDemographics_location: boolean;
    personality_introvert_extrovert: number;
    hasPersonality_introvert_extrovert: boolean;
    personality_thinking_feeling: number;
    hasPersonality_thinking_feeling: boolean;
    personality_sensing_intuition: number;
    hasPersonality_sensing_intuition: boolean;
    personality_judging_perceiving: number;
    hasPersonality_judging_perceiving: boolean;
    biography?: string;
    goals?: string;
    frustrations?: string;
    hasGoals_frustrations: boolean;
    skills: SkillMotivation[];
    hasSkills: boolean;
    motivations: SkillMotivation[];
    hasMotivations: boolean;
    hasDescription: boolean;

    // thumbnailPath?: string;
}

export interface SkillMotivation {
    id: UUID;
    name?: string;
    level: number;
}
