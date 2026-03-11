import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DemographicsGenderEnum } from '../enums/demographics-gender.enum';

export class UxPersonaResponseDto {
    @ApiProperty({ example: 'PROJECT#54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public projectSK: string;

    @ApiProperty({ example: 'UXPERS#bbf7c071-9f2f-45da-83c4-0779f2e676ba' })
    @IsNotEmpty()
    public uxPersonaSK: string;

    @ApiProperty({ example: 'Updated UX Persona name' })
    @IsNotEmpty()
    @MaxLength(100)
    public name: string;

    @ApiProperty({ example: 'Fat stinky software engineer' })
    @IsOptional()
    @MaxLength(50)
    public personality?: string;
    @ApiProperty()
    public hasDescription: boolean;

    @ApiProperty()
    public hasPersonality: boolean;

    @ApiProperty({ example: 27 })
    @IsOptional()
    public demographics_age?: number;

    @ApiProperty({ enum: DemographicsGenderEnum })
    @IsOptional()
    @IsEnum(DemographicsGenderEnum)
    public demographics_gender?: DemographicsGenderEnum;

    @ApiProperty({ example: 'Senior Rust Software Engineer' })
    @IsOptional()
    @MaxLength(50)
    public demographics_occupation?: string;
    @ApiProperty()
    @IsNotEmpty()
    public hasDemographics_occupation: boolean;

    @ApiProperty({ example: '120k USD/year' })
    @IsOptional()
    @MaxLength(50)
    public demographics_income?: string;
    @ApiProperty()
    @IsNotEmpty()
    public hasDemographics_income: boolean;

    @ApiProperty({ example: 'Los-Angeles, CA' })
    @IsOptional()
    @MaxLength(50)
    public demographics_location?: string;
    @ApiProperty()
    @IsNotEmpty()
    public hasDemographics_location: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public personality_introvert_extrovert: number;
    @ApiProperty()
    @IsNotEmpty()
    public hasPersonality_introvert_extrovert: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public personality_thinking_feeling: number;
    @ApiProperty()
    @IsNotEmpty()
    public hasPersonality_thinking_feeling: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public personality_sensing_intuition: number;
    @ApiProperty()
    @IsNotEmpty()
    public hasPersonality_sensing_intuition: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public personality_judging_perceiving: number;
    @ApiProperty()
    @IsNotEmpty()
    public hasPersonality_judging_perceiving: boolean;

    @ApiProperty({
        example:
            // eslint-disable-next-line max-len
            'Dedicated software engineer with 7 years of experience in full-stack development. Passionate about clean code and innovative solutions, they thrive in collaborative environments, continuously learning and adapting to new technologies.',
    })
    @IsOptional()
    @MaxLength(1000)
    public biography?: string;

    @ApiProperty({
        example: 'Raise a dog\nBecome more fat\nBuy all Nintendo games',
    })
    @IsOptional()
    @MaxLength(300)
    public goals?: string;

    @ApiProperty({
        example: 'Raise a cat\nBecome less fat\nBuy all Sony games',
    })
    @IsOptional()
    @MaxLength(300)
    public frustrations?: string;

    @ApiProperty()
    @IsNotEmpty()
    public hasGoals_frustrations: boolean;

    @ApiProperty({
        example: [
            {
                name: 'Skill name 1',
                level: 'text text text',
            },
        ],
    })
    @ValidateNested()
    @Type(() => PersonaSkillDto)
    @ArrayMaxSize(20)
    public skills: PersonaSkillDto[];
    @ApiProperty()
    @IsNotEmpty()
    public hasSkills: boolean;

    @ApiProperty({
        example: [
            {
                name: 'Motivation name 1',
                level: 'text text text',
            },
        ],
    })
    @ValidateNested()
    @Type(() => PersonaMotivationDto)
    @ArrayMaxSize(20)
    public motivations: PersonaMotivationDto[];
    @ApiProperty()
    @IsNotEmpty()
    public hasMotivations: boolean;
    //
    // @ApiProperty()
    // @IsOptional()
    // public thumbnailPath?: string;
}

export class PersonaSkillDto {
    @ApiProperty()
    @IsOptional()
    @MaxLength(50)
    public name?: string;

    @ApiProperty()
    @IsNotEmpty()
    public level: number;

    @ApiProperty({ example: '54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public id: string;
}

export class PersonaMotivationDto {
    @ApiProperty()
    @IsOptional()
    @MaxLength(50)
    public name?: string;

    @ApiProperty()
    @IsNotEmpty()
    public level: number;

    @ApiProperty({ example: '54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public id: string;
}
