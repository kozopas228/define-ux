import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateEmpathyMapDto {
    @ApiProperty({ example: 'PROJECT#54c12a62-6613-4e11-98b1-4624df7f0947' })
    @IsNotEmpty()
    public projectSK: string;

    @ApiProperty({ example: 'EMPMAP#bbf7c071-9f2f-45da-83c4-0779f2e676ba' })
    @IsNotEmpty()
    public empathyMapSK: string;

    @ApiProperty({ example: 'Updated Empathy Map name' })
    @IsNotEmpty()
    @MaxLength(100)
    public name: string;

    @ApiProperty({ example: 'Updated Says field' })
    @IsOptional()
    @MaxLength(500)
    public says?: string;

    @ApiProperty({ example: 'Updated Says field' })
    @IsOptional()
    @MaxLength(500)
    public does?: string;

    @ApiProperty({ example: 'Updated Thinks field' })
    @IsOptional()
    @MaxLength(500)
    public thinks?: string;

    @ApiProperty({ example: 'Updated Feels field' })
    @IsOptional()
    @MaxLength(500)
    public feels?: string;

    @ApiProperty({ example: 'Updated Pains field1 \n Update Pains field2' })
    @IsOptional()
    @MaxLength(500)
    public pains?: string;

    @ApiProperty({ example: 'Updated Gains field1 \n Update Gains field2' })
    @IsOptional()
    @MaxLength(500)
    public gains?: string;

    @ApiProperty({ example: 'UXPERS#bbf7c071-9f2f-45da-83c4-0779f2e676ba' })
    @IsOptional()
    public personaSK?: string;
}
