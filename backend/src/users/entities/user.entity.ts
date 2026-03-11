import { BaseEntity } from '../../common/base.entity';
import { v4 } from 'uuid';
import { AuthMethod } from '../enums/auth-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity extends BaseEntity {
    constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        username: string,
        authMethod: AuthMethod,
        password?: string,
    ) {
        super(pk, sk, createdAt, updatedAt);
        this.username = username;
        this.password = password;
        this.authMethod = authMethod;
    }

    @ApiProperty()
    public username: string;

    public password?: string;

    @ApiProperty()
    public authMethod: AuthMethod;

    public static readonly pkPrefix: string = 'USER';
    public static readonly skPrefix: string = 'USER';
    public static readonly entityType: string = 'User';

    public static build(
        username: string,
        authMethod: AuthMethod,
        password?: string,
    ): UserEntity {
        const uuid = v4();
        const pk = `${UserEntity.pkPrefix}#${uuid}`;
        const sk = `${UserEntity.skPrefix}#${uuid}`;
        return new UserEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            username,
            authMethod,
            password,
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: UserEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            username: this.username,
            password: this.password,
            authMethod: this.authMethod.toString(),
        };
    }
}
