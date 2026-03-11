import { AuthMethod } from '../../users/enums/auth-method.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SignInDto {
    @ApiProperty({ example: 'username1@mail.com' })
    @IsNotEmpty()
    public username: string;

    @ApiProperty({ example: 'test123_ASD' })
    @IsNotEmpty()
    public password: string;

}
