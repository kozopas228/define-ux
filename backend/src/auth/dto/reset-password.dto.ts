import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/constants/regex.constants';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    public userPK: string;

    @ApiProperty()
    @IsNotEmpty()
    public resetPasswordToken: string;

    @ApiProperty({ example: 'NEWpass321123' })
    @Matches(PASSWORD_REGEX, {
        message:
            'password should contain at least one upper case letter, ' +
            'one lower case letter and number or special character',
    })
    public newPassword: string;
}
