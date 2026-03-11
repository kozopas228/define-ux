import { BaseFeatureEntity } from '../../common/base-feature.entity';
import { v4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class EmpathyMapEntity extends BaseFeatureEntity {
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
    public static readonly skPrefix: string = 'EMPMAP';
    public static readonly entityType: string = 'EmpathyMap';

    @ApiProperty()
    public says?: string;

    @ApiProperty()
    public does?: string;

    @ApiProperty()
    public thinks?: string;

    @ApiProperty()
    public feels?: string;

    @ApiProperty()
    public pains?: string;

    @ApiProperty()
    public gains?: string;

    @ApiProperty()
    public personaSK?: string;

    public static build(pk: string): EmpathyMapEntity {
        const uuid = v4();
        const sk = `${EmpathyMapEntity.skPrefix}#${uuid}`;

        return new EmpathyMapEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            'Empathy Map Name',
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: EmpathyMapEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            name: this.name,
            thumbnailPath: this.thumbnailPath,
            says: this.says,
            does: this.does,
            thinks: this.thinks,
            feels: this.feels,
            pains: this.pains,
            gains: this.gains,
            personaSK: this.personaSK,
        };
    }
}
