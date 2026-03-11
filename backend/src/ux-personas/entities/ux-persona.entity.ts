import { BaseFeatureEntity } from '../../common/base-feature.entity';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { DemographicsGenderEnum } from '../enums/demographics-gender.enum';
import { PersonaSkillEntity } from './persona-skill.entity';
import { PersonaMotivationEntity } from './persona-motivation.entity';

export class UxPersonaEntity extends BaseFeatureEntity {
    public constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        name: string,
    ) {
        super(pk, sk, createdAt, updatedAt, name);
    }

    public static readonly pkPrefix: string = 'PROJECT';
    public static readonly skPrefix: string = 'UXPERS';
    public static readonly entityType: string = 'UXPersona';

    @ApiProperty()
    public personality?: string;

    @ApiProperty()
    public hasDescription: boolean;

    @ApiProperty()
    public hasPersonality: boolean;

    @ApiProperty()
    public demographics_age?: number;

    @ApiProperty()
    public demographics_gender?: DemographicsGenderEnum;

    @ApiProperty()
    public demographics_occupation?: string;
    @ApiProperty()
    public hasDemographics_occupation: boolean;

    @ApiProperty()
    public demographics_income?: string;
    @ApiProperty()
    public hasDemographics_income: boolean;

    @ApiProperty()
    public demographics_location?: string;
    @ApiProperty()
    public hasDemographics_location: boolean;

    @ApiProperty()
    public personality_introvert_extrovert: number;
    @ApiProperty()
    public hasPersonality_introvert_extrovert: boolean;

    @ApiProperty()
    public personality_thinking_feeling: number;
    @ApiProperty()
    public hasPersonality_thinking_feeling: boolean;

    @ApiProperty()
    public personality_sensing_intuition: number;
    @ApiProperty()
    public hasPersonality_sensing_intuition: boolean;

    @ApiProperty()
    public personality_judging_perceiving: number;
    @ApiProperty()
    public hasPersonality_judging_perceiving: boolean;

    @ApiProperty()
    public biography?: string;

    @ApiProperty()
    public goals?: string;

    @ApiProperty()
    public frustrations?: string;

    @ApiProperty()
    public hasGoals_frustrations: boolean;

    @ApiProperty()
    public skills: PersonaSkillEntity[];
    @ApiProperty()
    public hasSkills: boolean;

    @ApiProperty()
    public motivations: PersonaMotivationEntity[];
    @ApiProperty()
    public hasMotivations: boolean;

    public static build(pk: string): UxPersonaEntity {
        const uuid = v4();
        const sk = `${UxPersonaEntity.skPrefix}#${uuid}`;

        const newPersona = new UxPersonaEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            'Firstname Lastname',
        );

        newPersona.hasPersonality = true;
        newPersona.hasDescription = true;
        newPersona.hasDemographics_occupation = true;
        newPersona.hasDemographics_income = true;
        newPersona.hasDemographics_location = true;
        newPersona.personality_introvert_extrovert = 50;
        newPersona.hasPersonality_introvert_extrovert = true;
        newPersona.personality_thinking_feeling = 50;
        newPersona.hasPersonality_thinking_feeling = true;
        newPersona.personality_sensing_intuition = 50;
        newPersona.hasPersonality_sensing_intuition = true;
        newPersona.personality_judging_perceiving = 50;
        newPersona.hasPersonality_judging_perceiving = true;
        newPersona.hasGoals_frustrations = true;
        newPersona.hasSkills = true;
        newPersona.hasMotivations = true;

        return newPersona;
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: UxPersonaEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            name: this.name,
            thumbnailPath: this.thumbnailPath,
            personality: this.personality,
            hasDescription: this.hasDescription,
            hasPersonality: this.hasPersonality,
            demographics_age: this.demographics_age,
            demographics_gender: this.demographics_gender,
            demographics_occupation: this.demographics_occupation,
            hasDemographics_occupation: this.hasDemographics_occupation,
            demographics_income: this.demographics_income,
            hasDemographics_income: this.hasDemographics_income,
            demographics_location: this.demographics_location,
            hasDemographics_location: this.hasDemographics_location,
            personality_introvert_extrovert:
                this.personality_introvert_extrovert,
            hasPersonality_introvert_extrovert:
                this.hasPersonality_introvert_extrovert,
            personality_thinking_feeling: this.personality_thinking_feeling,
            hasPersonality_thinking_feeling:
                this.hasPersonality_thinking_feeling,
            personality_sensing_intuition: this.personality_sensing_intuition,
            hasPersonality_sensing_intuition:
                this.hasPersonality_sensing_intuition,
            personality_judging_perceiving: this.personality_judging_perceiving,
            hasPersonality_judging_perceiving:
                this.hasPersonality_judging_perceiving,
            biography: this.biography,
            goals: this.goals,
            frustrations: this.frustrations,
            hasGoals_frustrations: this.hasGoals_frustrations,
            hasSkills: this.hasSkills,
            hasMotivations: this.hasMotivations,
        };
    }
}
