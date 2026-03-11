import { v4 } from 'uuid';
import { BaseEntity } from '../../common/base.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectEntity extends BaseEntity {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public description?: string;

    @ApiProperty()
    public competitorAnalysisThumbnailPath?: string;

    @ApiProperty()
    public empathyMapThumbnailPath?: string;

    @ApiProperty()
    public uxPersonaThumbnailPath?: string;
    public constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        name: string,
        description?: string,
        competitorAnalysisThumbnailPath?: string,
        empathyMapThumbnailPath?: string,
        uxPersonaThumbnailPath?: string,
    ) {
        super(pk, sk, createdAt, updatedAt);
        this.name = name;
        this.description = description;
        this.competitorAnalysisThumbnailPath = competitorAnalysisThumbnailPath;
        this.empathyMapThumbnailPath = empathyMapThumbnailPath;
        this.uxPersonaThumbnailPath = uxPersonaThumbnailPath;
    }

    public static readonly pkPrefix: string = 'USER';
    public static readonly skPrefix: string = 'PROJECT';
    public static readonly entityType: string = 'Project';

    public static build(
        pk: string,
        name: string = 'Project name',
        description?: string,
        competitorAnalysisThumbnailPath?: string,
        empathyMapThumbnailPath?: string,
        uxPersonaThumbnailPath?: string,
    ): ProjectEntity {
        const uuid = v4();
        const sk = `${ProjectEntity.skPrefix}#${uuid}`;

        return new ProjectEntity(
            pk,
            sk,
            new Date(),
            new Date(),
            name,
            description,
            competitorAnalysisThumbnailPath,
            empathyMapThumbnailPath,
            uxPersonaThumbnailPath,
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: ProjectEntity.entityType,
            CREATED_AT: this.CREATED_AT.getTime(),
            UPDATED_AT: this.UPDATED_AT.getTime(),
            name: this.name,
            description: this.description,
            competitorAnalysisThumbnailPath:
                this.competitorAnalysisThumbnailPath,
            empathyMapThumbnailPath: this.empathyMapThumbnailPath,
            uxPersonaThumbnailPath: this.uxPersonaThumbnailPath,
        };
    }
}
