import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    MaxLength,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { CompetitorCriteriaTypeEnum } from '../enums/competitor-criteria-type.enum';
import { Type } from 'class-transformer';

export class CompetitorAnalysisResponseDto {
    @ApiProperty({ example: 'PROJECT#54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public projectSK: string;

    @ApiProperty({ example: 'COMPAN#bbf7c071-9f2f-45da-83c4-0779f2e676ba' })
    @IsNotEmpty()
    public competitorAnalysisSK: string;

    @ApiProperty({ example: 'Updated Competitor Analysis name' })
    @IsNotEmpty()
    @MaxLength(100)
    public name: string;

    @ApiProperty()
    @ValidateNested()
    @ArrayMaxSize(30)
    @Type(() => CompetitorResponseDto)
    competitors: CompetitorResponseDto[];
}

export class CompetitorResponseDto {
    @ApiProperty({ example: '54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public id: string;

    @ApiProperty({ example: 'Competitor name 1' })
    @IsOptional()
    @MaxLength(300)
    public name?: string;

    @ApiProperty()
    @ValidateNested()
    @ArrayMaxSize(30)
    @Type(() => CriteriaResponseDto)
    public criterias: CriteriaResponseDto[];
}

// this class must be above the previous one, otherwise validation doesn't work ;)
// nest is cool!
export class CriteriaValueResponseDto {
    @ApiProperty({ example: '54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public id: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(300)
    @ValidateIf((f) => typeof f === 'string')
    public value?: string | boolean;
}

export class CriteriaResponseDto {
    @ApiProperty({ example: '54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public id: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(300)
    public name?: string;

    @ApiProperty({ enum: CompetitorCriteriaTypeEnum })
    @IsNotEmpty()
    @IsEnum(CompetitorCriteriaTypeEnum)
    public type: CompetitorCriteriaTypeEnum;

    @ApiProperty()
    @ValidateNested()
    @Type(() => CriteriaValueResponseDto)
    public value: CriteriaValueResponseDto;
}
