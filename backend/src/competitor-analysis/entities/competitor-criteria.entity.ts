import { v4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { CompetitorCriteriaTypeEnum } from '../enums/competitor-criteria-type.enum';

export class CompetitorCriteriaEntity extends BaseEntity {
    public constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        order: number,
        type: CompetitorCriteriaTypeEnum,
        name?: string,
        value?: string,
    ) {
        super(pk, sk, createdAt, updatedAt);

        this.order = order;
        this.name = name;
        this.value = value;
        this.type = type;
    }

    public static readonly pkPrefix: string = 'COMPETITOR';
    public static readonly skPrefix: string = 'COMPCRIT';
    public static readonly entityType: string = 'CompetitorCriteria';

    @ApiProperty()
    public order: number;

    @ApiProperty()
    public name?: string;

    @ApiProperty()
    public value?: string;

    @ApiProperty()
    public type: CompetitorCriteriaTypeEnum;

    public static build(
        pk: string,
        skUuid: string,
        order: number,
        type: CompetitorCriteriaTypeEnum,
        name?: string,
        value?: string,
    ): CompetitorCriteriaEntity {
        const sk = `${CompetitorCriteriaEntity.skPrefix}#${skUuid}`;

        return new CompetitorCriteriaEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            order,
            type,
            name,
            value,
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: CompetitorCriteriaEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            order: this.order,
            type: this.type,
            name: this.name,
            value: this.value,
        };
    }
}
