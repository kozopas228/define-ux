import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { AuthMethod } from './enums/auth-method.enum';
import { hash } from 'bcrypt';
import { EMAIL_REGEX } from '../common/constants/regex.constants';
import { BaseService } from '../common/base.service';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { RefreshTokenEntity } from '../auth/entities/refresh-token.entity';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { ConfigService } from '@nestjs/config';
import { SesClientService } from '../aws/ses-client.service';

@Injectable()
export class UsersService extends BaseService {
    constructor(
        dynamoDbClientService: DynamoDbClientService,
        s3ClientService: S3ClientService,
        configService: ConfigService,
        sesClientService: SesClientService,
    ) {
        super(
            dynamoDbClientService,
            s3ClientService,
            sesClientService,
            configService,
        );
    }

    public async findOne(pk: string, sk: string): Promise<UserEntity> {
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': pk,
                ':sk': sk,
                ':type': UserEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        if (!response.Items || response.Items.length === 0) {
            throw new NotFoundException('User was not found');
        }

        return response.Items[0] as UserEntity;
    }

    public async findOneByUsername(username: string): Promise<UserEntity> {
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            IndexName: 'ENTITY_TYPE-index',
            KeyConditionExpression: 'ENTITY_TYPE = :type',
            FilterExpression: 'username = :uname',
            ExpressionAttributeValues: {
                ':type': UserEntity.entityType,
                ':uname': username,
            },
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        if (!response.Items || response.Items.length === 0) {
            throw new NotFoundException('User was not found');
        }

        return response.Items[0] as UserEntity;
    }

    public async create(
        username: string,
        authMethod: AuthMethod,
        hashedPassword?: string,
    ): Promise<UserEntity> {
        const user = UserEntity.build(username, authMethod, hashedPassword);

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: user.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);

        return user;
    }

    public async updatePassword(
        userPK: string,
        hashedPassword: string,
    ): Promise<void> {
        const userFromDb = await this.findOne(userPK, userPK);
        userFromDb.password = hashedPassword;
        const user = new UserEntity(
            userFromDb.PK,
            userFromDb.SK,
            new Date(userFromDb.CREATED_AT),
            new Date(userFromDb.UPDATED_AT),
            userFromDb.username,
            userFromDb.authMethod,
            userFromDb.password,
        );

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: user.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    public async doesUserExists(username: string): Promise<boolean> {
        try {
            await this.findOneByUsername(username);
        } catch (e) {
            if (e instanceof NotFoundException) {
                return false;
            }
        }

        return true;
    }
}
