import { AuthMethod } from '../../users/enums/auth-method.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/constants/regex.constants';

export class SignUpDto {
    @ApiProperty({ example: 'username1@mail.com' })
    @IsNotEmpty()
    public username: string;

    @ApiProperty({ example: 'test123_ASD' })
    @Matches(PASSWORD_REGEX, {
        message:
            'password should contain at least one upper case letter, ' +
            'one lower case letter and number or special character',
    })
    @IsNotEmpty()
    public password: string;
}
