import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenPairResponse } from './dto/token-pair.response';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { UserEntity } from '../users/entities/user.entity';
import {
    SendEmailCommand,
    SendEmailRequest,
    SESClient,
} from '@aws-sdk/client-ses';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { SimpleMessageResponse } from '../common/simple-message.response';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestWithUser } from '../common/request-with-user';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @ApiOperation({
        description: 'User sign up, creates new user in DB.',
    })
    @ApiCreatedResponse({
        description: 'Successful user sign up.',
        type: UserEntity,
    })
    @ApiConflictResponse({ description: 'User is already created' })
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    public async signUp(@Body() signUpDto: SignUpDto): Promise<UserEntity> {
        const response = await this.authService.signUp(
            signUpDto.username,
            signUpDto.password,
        );

        return response!;
    }

    @ApiOperation({
        description: 'User sign in, refresh token is set in http cookie.',
    })
    @ApiOkResponse({
        description: 'Successful user sign in.',
        type: TokenPairResponse,
    })
    @ApiNotFoundResponse({ description: 'User was not found' })
    @ApiUnauthorizedResponse({ description: 'Wrong user credentials' })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    public async signIn(
        @Req() req: Request,
        @Body() signInDto: SignInDto,
        @Res() res: Response,
    ): Promise<any> {
        const { access_token, refresh_token } = await this.authService.signIn(
            signInDto.username,
            signInDto.password,
        );

        return res
            .cookie(
                this.configService.get('REFRESH_COOKIE_NAME')!,
                refresh_token,
                {
                    secure: true,
                    httpOnly: true,
                    signed: true,
                },
            )
            .status(HttpStatus.OK)
            .json({
                access_token,
            });
    }

    @ApiOperation({
        summary: 'Recreate tokens',
        description:
            'Recreates the pair of access and refresh tokens, refresh token is set in http cookie.',
    })
    @ApiOkResponse({
        description: 'Successful token refresh.',
        type: TokenPairResponse,
    })
    @ApiNotFoundResponse({
        description: 'User was not found OR Refresh token was not found',
    })
    @ApiUnauthorizedResponse({
        description:
            'Wrong user credentials OR Refresh token expired OR Refresh token revoked',
    })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('refresh-tokens')
    public async refreshToken(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {
        const refreshToken = req.signedCookies.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException(
                'Refresh token was not present in cookies',
            );
        }

        const { access_token, refresh_token } =
            await this.authService.refreshTokens(refreshToken);

        return res
            .cookie(
                this.configService.get('REFRESH_COOKIE_NAME')!,
                refresh_token,
                {
                    secure: true,
                    httpOnly: true,
                    signed: true,
                },
            )
            .status(HttpStatus.OK)
            .json({
                access_token,
            });
    }

    @ApiOperation({
        summary: 'Revoke (cancel) refresh token',
        description: 'Revokes refresh token, taken from http cookie',
    })
    @ApiOkResponse({ description: 'Successful token revoke' })
    @ApiNotFoundResponse({ description: 'Refresh token was not found' })
    @ApiUnauthorizedResponse({
        description:
            'Refresh token is already revoked OR Refresh token was not present in cookies',
    })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('revoke-token')
    public async revokeToken(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {
        const refreshToken = req.signedCookies.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException(
                'Refresh token was not present in cookies',
            );
        }

        await this.authService.revokeToken(refreshToken);

        return res.status(HttpStatus.OK).json({
            message: 'Token successfully revoked',
        });
    }

    @ApiOperation({
        summary: 'Redirect URL from Google OAuth',
        description:
            'Used in frontend and google oauth site to redirect. ' +
            'Returns access token and stores refresh token in cookies',
    })
    @ApiOkResponse({
        description: 'Successful login/register',
        type: TokenPairResponse,
    })
    @ApiUnauthorizedResponse({
        description:
            'Error happened during authentication in the side of google auth website',
    })
    @Public()
    @Post('google/callback')
    public async googleCallback(
        @Body() body: { code: string },
        @Res() res: Response,
    ): Promise<any> {
        const { code } = body;

        const { access_token, refresh_token } =
            await this.authService.authGoogle(code);

        return res
            .cookie(
                this.configService.get('REFRESH_COOKIE_NAME')!,
                refresh_token,
                {
                    secure: true,
                    httpOnly: true,
                    signed: true,
                },
            )
            .status(HttpStatus.OK)
            .json({
                access_token,
            });
    }

    @ApiOperation({
        summary: 'Retrieve password restore email',
        description:
            'Password restoration email is sent to email address, nothing is returned',
    })
    @ApiOkResponse({
        description: 'Successful email sent',
    })
    @ApiBadRequestResponse({
        description: 'Auth method should be password to change the password',
    })
    @ApiNotFoundResponse({
        description: 'User was not found',
    })
    @Post('request-password-reset')
    @Public()
    public async requestPasswordReset(
        @Body() requestPasswordResetDto: RequestPasswordResetDto,
    ): Promise<SimpleMessageResponse> {
        await this.authService.requestPasswordReset(
            requestPasswordResetDto.username,
        );

        return {
            message: 'Password restoration email has been sent successfully',
        };
    }

    @ApiOkResponse({
        description: 'Successful email sent',
    })
    @ApiNotFoundResponse({
        description: 'User was not found',
    })
    @ApiUnauthorizedResponse({
        description:
            'Reset password token expired OR Reset password token revoked',
    })
    @Post('reset-password')
    @Public()
    public async resetPassword(
        @Body() passwordResetDto: ResetPasswordDto,
    ): Promise<SimpleMessageResponse> {
        await this.authService.resetPassword(
            passwordResetDto.userPK,
            passwordResetDto.resetPasswordToken,
            passwordResetDto.newPassword,
        );

        return {
            message: 'Password has been successfully reset',
        };
    }

    @ApiOkResponse({
        description: 'Password has been successfully changed',
    })
    @ApiNotFoundResponse({
        description: 'User was not found',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid JWT access token',
    })
    @ApiBearerAuth()
    @Post('change-password')
    public async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Req() request: RequestWithUser,
    ): Promise<SimpleMessageResponse> {
        const refreshToken = request.signedCookies.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException(
                'Refresh token was not present in cookies',
            );
        }

        await this.authService.changePassword(
            request.user.PK,
            changePasswordDto.newPassword,
            refreshToken,
        );

        return {
            message: 'Password has been successfully changed',
        };
    }

    @ApiOperation({
        summary: 'Delete account by access token',
    })
    @ApiNoContentResponse({
        description: 'User has been successfully deleted',
    })
    @ApiNotFoundResponse({
        description: 'User was not found',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid JWT access token',
    })
    @ApiBearerAuth()
    @Delete('delete-account')
    public async deleteUser(@Req() request: RequestWithUser): Promise<void> {
        await this.authService.deleteUser(request.user.PK);
    }
}
