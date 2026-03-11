import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class UpdateProjectDto {
    @ApiProperty()
    @IsNotEmpty()
    public SK: string;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    public name?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(500)
    public description?: string;
}
