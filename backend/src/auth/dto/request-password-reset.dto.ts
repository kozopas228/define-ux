import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
    @ApiProperty()
    @IsNotEmpty()
    public username: string;
}
