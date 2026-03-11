export interface UxPersona {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    name: string;
    thumbnailPath?: string;
    personality?: string;
    hasPersonality: boolean;
    demographics_age?: number;
    demographics_gender?: DemographicsGenderEnum;
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
    skills: PersonaSkill[];
    hasSkills: boolean;
    motivations: PersonaMotivation[];
    hasMotivations: boolean;
}

export interface PersonaSkill {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    order: number;
    name?: string;
    level: number;
}

export interface PersonaMotivation {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    order: number;
    name?: string;
    level: number;
}

export enum DemographicsGenderEnum {
    male = 'male',
    female = 'female',
}
