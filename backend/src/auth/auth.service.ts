import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPairResponse } from './dto/token-pair.response';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { v4 } from 'uuid';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { BaseService } from '../common/base.service';
import {
    DeleteCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserEntity } from '../users/entities/user.entity';
import { compare, hash } from 'bcryptjs';
import { AuthMethod } from '../users/enums/auth-method.enum';
import { EMAIL_REGEX } from '../common/constants/regex.constants';
import { ResetPasswordTokenEntity } from './entities/reset-password-token.entity';
import { SendEmailCommand, SendEmailRequest } from '@aws-sdk/client-ses';
import { SesClientService } from '../aws/ses-client.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService extends BaseService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        configService: ConfigService,
        dynamoDbClientService: DynamoDbClientService,
        s3ClientService: S3ClientService,
        sesClientService: SesClientService,
    ) {
        super(
            dynamoDbClientService,
            s3ClientService,
            sesClientService,
            configService,
        );

        this.logger = new Logger();
    }

    private logger: Logger;

    public async signUp(
        username: string,
        password: string,
    ): Promise<UserEntity | undefined> {
        if (await this.usersService.doesUserExists(username)) {
            throw new ConflictException(
                'User with this username already exists',
            );
        }

        // other password validation is performed through class-transformer decorators
        if (!password) {
            throw new BadRequestException(
                'Password should be not empty via this authentication method',
            );
        }

        if (!EMAIL_REGEX.test(username)) {
            throw new BadRequestException(
                'Username must be an email in this authentication method',
            );
        }

        const hashedPassword = await hash(password, 5);

        const user = await this.usersService.create(
            username,
            AuthMethod.password,
            hashedPassword,
        );

        // so that the password is not exposed in the API
        user.password = undefined;

        return user;
    }

    public async signIn(
        username: string,
        password: string,
    ): Promise<TokenPairResponse> {
        const user = await this.usersService.findOneByUsername(username);

        if (!password) {
            throw new BadRequestException(
                'Password should be not empty via this authentication method',
            );
        }

        if (!(await compare(password, user.password!))) {
            throw new UnauthorizedException('Wrong credentials');
        }

        const refreshTokenId = v4();
        const refreshTokenEntity = RefreshTokenEntity.build(
            user.PK,
            refreshTokenId,
            false,
        );

        await this.putRefreshTokenToDatabase(refreshTokenEntity);

        return await this.generateTokens(user, refreshTokenId);
    }

    public async refreshTokens(
        refreshToken: string,
    ): Promise<TokenPairResponse> {
        const verified = await this.verifyRefreshToken(refreshToken);

        const tokenInDbEntity = await this.findRefreshToken(
            verified.PK,
            verified.refreshTokenId,
        );

        if (tokenInDbEntity.revoked) {
            throw new UnauthorizedException('Refresh token is revoked');
        }

        await this.revokeToken(refreshToken);

        const user = await this.usersService.findOneByUsername(
            verified.username,
        );

        const newRefreshTokenId = v4();
        const newRefreshTokenEntity = RefreshTokenEntity.build(
            user.PK,
            newRefreshTokenId,
            false,
        );

        await this.putRefreshTokenToDatabase(newRefreshTokenEntity);

        return await this.generateTokens(user, newRefreshTokenId);
    }

    public async revokeToken(refreshToken: string): Promise<void> {
        this.logger.log('REVOKE SINGLE TOKEN');

        const verified = await this.verifyRefreshToken(refreshToken);

        const tokenInDbEntity = await this.findRefreshToken(
            verified.PK,
            verified.refreshTokenId,
        );

        if (tokenInDbEntity.revoked) {
            throw new UnauthorizedException('Refresh token is already revoked');
        }

        const command = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: { PK: tokenInDbEntity.PK, SK: tokenInDbEntity.SK },
            UpdateExpression: 'set revoked = :rev',
            ExpressionAttributeValues: {
                ':rev': true,
            },
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    public async revokeAllUserTokens(
        userPK: string,
        refreshTokenToSave: string,
    ): Promise<void> {
        const verified = await this.verifyRefreshToken(refreshTokenToSave);

        this.logger.log('REVOKE ALL');

        const findAllCommand = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk',
            FilterExpression: 'ENTITY_TYPE = :type ',
            ExpressionAttributeValues: {
                ':pk': userPK,
                ':type': RefreshTokenEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(findAllCommand);

        if (!response.Items) {
            return;
        }

        const updateRequests = [];
        for (const token of response.Items as RefreshTokenEntity[]) {
            if (
                token.SK ===
                `${RefreshTokenEntity.skPrefix}#${verified.refreshTokenId}`
            ) {
                return;
            }

            updateRequests.push({
                UpdateRequest: {
                    TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
                    Key: { PK: token.PK, SK: token.SK },
                    UpdateExpression: 'set revoked = :rev',
                    ExpressionAttributeValues: {
                        ':rev': true,
                    },
                },
            });
        }

        await this.executeBatchRequests(updateRequests);
    }

    public async authGoogle(code: string): Promise<TokenPairResponse> {
        const googleClientId =
            this.configService.get<string>('GOOGLE_CLIENT_ID');
        const googleClientSecret = this.configService.get<string>(
            'GOOGLE_CLIENT_SECRET',
        );
        const googleAccessTokenUrl = this.configService.get<string>(
            'GOOGLE_ACCESS_TOKEN_URL',
        );
        const googleTokenInfoUrl = this.configService.get<string>(
            'GOOGLE_TOKEN_INFO_URL',
        );

        const data = {
            code,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: this.configService.get('FRONTEND_URL') + '/',
            grant_type: 'authorization_code',
        };

        const response = await fetch(googleAccessTokenUrl!, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new UnauthorizedException('Error during authentication');
        }

        const accessToken = await response.json();

        const { id_token } = accessToken;

        const tokenInfoResponse = await fetch(
            `${googleTokenInfoUrl}?id_token=${id_token}`,
        );

        const { email } = await tokenInfoResponse.json();

        if (!(await this.usersService.doesUserExists(email))) {
            await this.usersService.create(email, AuthMethod.google);
        }

        const user = await this.usersService.findOneByUsername(email);

        const refreshTokenId = v4();
        const refreshTokenEntity = RefreshTokenEntity.build(
            user.PK,
            refreshTokenId,
            false,
        );

        await this.putRefreshTokenToDatabase(refreshTokenEntity);

        return await this.generateTokens(user, refreshTokenId);
    }

    public async requestPasswordReset(username: string): Promise<void> {
        const user = await this.usersService.findOneByUsername(username);

        if (user.authMethod !== AuthMethod.password) {
            throw new BadRequestException(
                'Auth method should be password to change the password',
            );
        }

        const resetPasswordTokenId = v4();
        const resetPasswordTokenEntity = ResetPasswordTokenEntity.build(
            user.PK,
            resetPasswordTokenId,
            false,
        );

        const refreshTokenPayload = {
            PK: user.PK,
            SK: resetPasswordTokenEntity.SK,
            username: user.username,
            authMethod: user.authMethod,
        };

        const token = await this.jwtService.signAsync(refreshTokenPayload, {
            secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
            expiresIn: this.configService.get('JWT_RESET_PASSWORD_TTL'),
        });

        await this.putResetPasswordTokenToDatabase(resetPasswordTokenEntity);

        const frontendUrl = this.configService.get('FRONTEND_URL');
        const resetPasswordUrl = `${frontendUrl}/passwordReset?token=${token}&userPK=${user.PK}`;

        await this.sendRestorationEmail(username, resetPasswordUrl);
    }

    public async resetPassword(
        userPK: string,
        resetPasswordToken: string,
        newPassword: string,
    ): Promise<void> {
        const verifiedToken =
            await this.verifyResetPasswordToken(resetPasswordToken);

        const token = await this.findResetPasswordToken(
            userPK,
            verifiedToken.SK,
        );

        if (token.revoked) {
            throw new BadRequestException('Reset Password token is revoked');
        }

        const hashedPassword = await hash(newPassword, 5);

        await this.usersService.updatePassword(userPK, hashedPassword);

        const command = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: { PK: token.PK, SK: token.SK },
            UpdateExpression: 'set revoked = :rev',
            ExpressionAttributeValues: {
                ':rev': true,
            },
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    public async changePassword(
        userPK: string,
        newPassword: string,
        refreshTokenToSave: string,
    ): Promise<void> {
        const hashedPassword = await hash(newPassword, 5);

        await this.usersService.updatePassword(userPK, hashedPassword);
        await this.revokeAllUserTokens(userPK, refreshTokenToSave);
    }

    public async deleteUser(userPK: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: userPK,
                SK: userPK,
            },
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    public async deleteAllRevokedTokens() {
        const deleteRequests = [];

        const findAllRefreshCommand = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            IndexName: 'ENTITY_TYPE-index',
            KeyConditionExpression: 'ENTITY_TYPE = :type',
            FilterExpression: 'revoked = :rev',
            ExpressionAttributeValues: {
                ':type': RefreshTokenEntity.entityType,
                ':rev': true,
            },
        });

        const findAllRefreshResponse = await this.dynamoDbClientService
            .getClient()
            .send(findAllRefreshCommand);

        if (findAllRefreshResponse.Items) {
            for (const token of findAllRefreshResponse.Items as RefreshTokenEntity[]) {
                deleteRequests.push({
                    DeleteRequest: {
                        Key: {
                            PK: token.PK,
                            SK: token.SK,
                        },
                    },
                });
            }
        }

        const findAllResetPasswordCommand = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            IndexName: 'ENTITY_TYPE-index',
            KeyConditionExpression: 'ENTITY_TYPE = :type',
            FilterExpression: 'revoked = :rev',
            ExpressionAttributeValues: {
                ':type': ResetPasswordTokenEntity.entityType,
                ':rev': true,
            },
        });

        const findAllResetPasswordResponse = await this.dynamoDbClientService
            .getClient()
            .send(findAllResetPasswordCommand);

        if (findAllResetPasswordResponse.Items) {
            for (const token of findAllResetPasswordResponse.Items as ResetPasswordTokenEntity[]) {
                deleteRequests.push({
                    DeleteRequest: {
                        Key: {
                            PK: token.PK,
                            SK: token.SK,
                        },
                    },
                });
            }
        }

        this.logger.log(
            `Delete all revoked tokens. Deleted ${findAllRefreshResponse.Items?.length} refresh,` +
                ` ${findAllResetPasswordResponse.Items?.length} reset password`,
        );
        await this.executeBatchRequests(deleteRequests);
    }

    private async sendRestorationEmail(
        toEmail: string,
        restorationEmailUrl: string,
    ): Promise<void> {
        const params: SendEmailRequest = {
            Source: this.configService.get('AWS_SES_EMAIL_FROM'),
            Destination: {
                ToAddresses: [toEmail],
            },
            Message: {
                Subject: {
                    Data: 'Password restoration',
                    Charset: 'utf-8',
                },
                Body: {
                    Html: {
                        Data: `
                            Your email restoration link:
                            
                            ${restorationEmailUrl}
                        `,
                        Charset: 'utf-8',
                    },
                },
            },
        };

        const sendCommand = new SendEmailCommand(params);

        try {
            await this.sesClientService.getClient().send(sendCommand);
        } catch (e) {
            throw new BadRequestException('Error while sending email');
        }
    }

    private async verifyRefreshToken(refreshToken: string): Promise<any> {
        let verified: any;

        try {
            verified = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException('Refresh token expired');
            }
        }

        if (!verified) {
            throw new UnauthorizedException('Refresh token is invalid');
        }

        return verified;
    }

    private async findRefreshToken(
        pk: string,
        refreshTokenId: string,
    ): Promise<RefreshTokenEntity> {
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': pk,
                ':sk': `${RefreshTokenEntity.skPrefix}#${refreshTokenId}`,
                ':type': RefreshTokenEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        if (!response.Items || response.Items.length === 0) {
            throw new NotFoundException('Refresh token was not found');
        }

        return response.Items[0] as RefreshTokenEntity;
    }

    private async putRefreshTokenToDatabase(
        refreshTokenEntity: RefreshTokenEntity,
    ): Promise<void> {
        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: refreshTokenEntity.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    private async verifyResetPasswordToken(
        resetPasswordToken: string,
    ): Promise<any> {
        let verified: any;

        try {
            verified = await this.jwtService.verifyAsync(resetPasswordToken, {
                secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
            });
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException('Reset Password token expired');
            }
        }

        if (!verified) {
            throw new UnauthorizedException('Reset Password token is invalid');
        }

        return verified;
    }

    private async findResetPasswordToken(
        pk: string,
        sk: string,
    ): Promise<ResetPasswordTokenEntity> {
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': pk,
                ':sk': sk,
                ':type': ResetPasswordTokenEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        if (!response.Items || response.Items.length === 0) {
            throw new NotFoundException('Reset Password token was not found');
        }

        return response.Items[0] as ResetPasswordTokenEntity;
    }

    private async putResetPasswordTokenToDatabase(
        resetPasswordToken: ResetPasswordTokenEntity,
    ): Promise<void> {
        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: resetPasswordToken.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    private async generateTokens(user: UserEntity, refreshTokenId: string) {
        const accessTokenPayload = {
            PK: user.PK,
            SK: user.SK,
            username: user.username,
            authMethod: user.authMethod,
        };

        const refreshTokenPayload = {
            PK: user.PK,
            SK: user.SK,
            username: user.username,
            authMethod: user.authMethod,
            refreshTokenId,
        };

        return {
            access_token: await this.jwtService.signAsync(accessTokenPayload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_TTL'),
            }),
            refresh_token: await this.jwtService.signAsync(
                refreshTokenPayload,
                {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get('JWT_REFRESH_TTL'),
                },
            ),
        };
    }
}
