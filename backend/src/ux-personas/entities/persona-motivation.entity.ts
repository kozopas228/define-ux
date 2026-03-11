import { BaseEntity } from '../../common/base.entity';
import { v4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class PersonaMotivationEntity extends BaseEntity {
    public constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        order: number,
        level: number,
        name?: string,
    ) {
        super(pk, sk, createdAt, updatedAt);
        this.order = order;
        this.name = name;
        this.level = level;
    }

    public static readonly pkPrefix: string = 'UXPERS';
    public static readonly skPrefix: string = 'PERSMOTIV';
    public static readonly entityType: string = 'UXPersonaMotivation';

    @ApiProperty()
    public order: number;

    @ApiProperty()
    public name?: string;

    @ApiProperty()
    public level: number;

    public static build(
        pk: string,
        order: number,
        id: string,
        level: number,
        name?: string,
    ): PersonaMotivationEntity {
        const sk = `${PersonaMotivationEntity.skPrefix}#${id}`;

        return new PersonaMotivationEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            order,
            level,
            name,
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: PersonaMotivationEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            order: this.order,
            level: this.level,
            name: this.name,
        };
    }
}
