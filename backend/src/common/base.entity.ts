import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export abstract class BaseEntity {
    @ApiProperty()
    public PK: string;

    @ApiProperty()
    public SK: string;

    @ApiProperty()
    public CREATED_AT: Date;

    @ApiProperty()
    public UPDATED_AT: Date;

    protected constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.PK = pk;
        this.SK = sk;
        this.CREATED_AT = createdAt;
        this.UPDATED_AT = updatedAt;
    }

    public static readonly pkPrefix: string;
    public static readonly skPrefix: string;
    public static readonly entityType: string;

    public abstract toDynamoDbItem(): Record<string, unknown>;
}
