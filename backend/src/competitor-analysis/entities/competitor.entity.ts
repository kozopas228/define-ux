import { v4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { CompetitorCriteriaEntity } from './competitor-criteria.entity';

export class CompetitorEntity extends BaseEntity {
    public constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        order: number,
        name?: string,
    ) {
        super(pk, sk, createdAt, updatedAt);

        this.order = order;
        this.name = name;
    }

    public static readonly pkPrefix: string = 'COMPAN';
    public static readonly skPrefix: string = 'COMPETITOR';
    public static readonly entityType: string = 'Competitor';

    @ApiProperty()
    public order: number;

    @ApiProperty()
    public name?: string;

    @ApiProperty()
    public criterias: CompetitorCriteriaEntity[] = [];

    public static build(
        pk: string,
        order: number,
        name?: string,
    ): CompetitorEntity {
        const uuid = v4();
        const sk = `${CompetitorEntity.skPrefix}#${uuid}`;

        return new CompetitorEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            order,
            name,
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: CompetitorEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            order: this.order,
            name: this.name,
        };
    }
}
