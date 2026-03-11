import { BaseFeatureEntity } from '../../common/base-feature.entity';
import { v4 } from 'uuid';
import { CompetitorEntity } from './competitor.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CompetitorAnalysisEntity extends BaseFeatureEntity {
    public constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        name: string,
    ) {
        super(pk, sk, createdAt, updatedAt, name);
    }

    public static readonly pkPrefix: string = 'PROJECT';
    public static readonly skPrefix: string = 'COMPAN';
    public static readonly entityType: string = 'CompetitorAnalysis';

    @ApiProperty()
    public competitors: CompetitorEntity[] = [];

    public static build(pk: string): CompetitorAnalysisEntity {
        const uuid = v4();
        const sk = `${CompetitorAnalysisEntity.skPrefix}#${uuid}`;

        return new CompetitorAnalysisEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            'Competitor Analysis Name',
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: CompetitorAnalysisEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            name: this.name,
            thumbnailPath: this.thumbnailPath,
        };
    }
}
