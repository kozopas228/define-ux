import { BaseEntity } from '../../common/base.entity';
import { AuthMethod } from '../../users/enums/auth-method.enum';
import { v4 } from 'uuid';

export class RefreshTokenEntity extends BaseEntity {
    constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        revoked: boolean,
    ) {
        super(pk, sk, createdAt, updatedAt);
        this.revoked = revoked;
    }

    public revoked: boolean;

    public static readonly pkPrefix: string = 'USER';
    public static readonly skPrefix: string = 'REFRESH';
    public static readonly entityType: string = 'RefreshToken';

    public static build(
        pk: string,
        id: string,
        revoked: boolean,
    ): RefreshTokenEntity {
        const sk = `${RefreshTokenEntity.skPrefix}#${id}`;
        return new RefreshTokenEntity(pk, sk, new Date(), new Date(), revoked);
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: RefreshTokenEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            revoked: this.revoked,
        };
    }
}
