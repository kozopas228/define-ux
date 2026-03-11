import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCompetitorAnalysisDto } from './dto/create-competitor-analysis.dto';
import { CompetitorAnalysisEntity } from './entities/competitor-analysis.entity';
import {
    BatchWriteCommand,
    DeleteCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { BaseService } from '../common/base.service';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';
import { CompetitorEntity } from './entities/competitor.entity';
import { CompetitorCriteriaEntity } from './entities/competitor-criteria.entity';
import { v4 } from 'uuid';
import { SesClientService } from '../aws/ses-client.service';
import {
    CompetitorAnalysisResponseDto,
    CompetitorResponseDto,
    CriteriaResponseDto,
    CriteriaValueResponseDto,
} from './dto/competitor-analysis-response.dto';
import {
    MAX_FEATURES_COUNT,
    MAX_PROJECTS_COUNT,
} from '../common/constants/validations.constants';

@Injectable()
export class CompetitorAnalysisService extends BaseService {
    constructor(
        dynamoDbClientService: DynamoDbClientService,
        s3ClientService: S3ClientService,
        configService: ConfigService,
        sesClientService: SesClientService,
        private projectsService: ProjectsService,
    ) {
        super(
            dynamoDbClientService,
            s3ClientService,
            sesClientService,
            configService,
        );
    }

    public async findOne(
        userPK: string,
        PK: string,
        SK: string,
    ): Promise<CompetitorAnalysisEntity> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entity = await this.findEntity<CompetitorAnalysisEntity>(
            PK,
            SK,
            CompetitorAnalysisEntity.entityType,
            'Competitor Analysis',
        );

        entity.competitors = await this.findEntities<CompetitorEntity>(
            SK,
            CompetitorEntity.entityType,
        );

        for (const competitor of entity.competitors) {
            competitor.criterias =
                await this.findEntities<CompetitorCriteriaEntity>(
                    competitor.SK,
                    CompetitorCriteriaEntity.entityType,
                );
        }

        entity.thumbnailPath = await this.getS3SignedUrl(entity.thumbnailPath);
        return entity;
    }

    public async findAllByPK(
        userPK: string,
        PK: string,
    ): Promise<CompetitorAnalysisEntity[]> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entities = await this.findEntities<CompetitorAnalysisEntity>(
            PK,
            CompetitorAnalysisEntity.entityType,
        );

        if (entities.length === 0) {
            throw new NotFoundException('Competitor Analysis were not found');
        }

        for (const entity of entities) {
            entity.thumbnailPath = await this.getS3SignedUrl(
                entity.thumbnailPath,
            );
        }

        return entities;
    }

    public async create(
        userPK: string,
        createDto: CreateCompetitorAnalysisDto,
    ): Promise<CompetitorAnalysisEntity> {
        const newEntity = CompetitorAnalysisEntity.build(createDto.projectSK);

        if (
            await this.doesEntityExist(
                newEntity.PK,
                newEntity.SK,
                CompetitorAnalysisEntity.entityType,
            )
        ) {
            throw new ConflictException(
                'Item with this properties already exists.',
            );
        }

        await this.projectsService.checkProjectBelongPermission(
            userPK,
            createDto.projectSK,
        );

        try {
            const allUserCompetitorAnalysisPerCurrentProject =
                await this.findAllByPK(userPK, createDto.projectSK);

            if (
                allUserCompetitorAnalysisPerCurrentProject.length >=
                MAX_FEATURES_COUNT
            ) {
                throw new BadRequestException(
                    'Maximum Competitor Analysis count per project exceeds',
                );
            }
        } catch (e) {
            if (!(e instanceof NotFoundException)) {
                throw e;
            }
        }

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: newEntity.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);

        await this.projectsService.updateProjectUpdateTime(
            userPK,
            newEntity.PK,
        );

        return newEntity;
    }

    public async update(
        userPK: string,
        updateDto: CompetitorAnalysisResponseDto,
    ): Promise<void> {
        const competitorAnalysisEntity = await this.findOne(
            userPK,
            updateDto.projectSK,
            updateDto.competitorAnalysisSK,
        );

        await this.cleanupAllCompetitors(competitorAnalysisEntity);

        const putRequests = [];

        const updateNameCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: competitorAnalysisEntity.PK,
                SK: competitorAnalysisEntity.SK,
            },
            UpdateExpression: 'set #analName = :analName, UPDATED_AT = :updAt',
            ExpressionAttributeValues: {
                ':analName': updateDto.name,
                ':updAt': new Date().getTime(),
            },
            ExpressionAttributeNames: {
                '#analName': 'name',
            },
        });

        await this.dynamoDbClientService.getClient().send(updateNameCommand);

        for (let i = 0; i < updateDto.competitors.length; i++) {
            const competitorEntity = CompetitorEntity.build(
                updateDto.competitorAnalysisSK,
                i + 1,
                updateDto.competitors[i].name,
            );

            putRequests.push({
                PutRequest: {
                    Item: competitorEntity.toDynamoDbItem(),
                },
            });

            for (
                let j = 0;
                j < updateDto.competitors[i].criterias.length;
                j++
            ) {
                const competitor = updateDto.competitors[i];
                const criteriaEntity = CompetitorCriteriaEntity.build(
                    competitorEntity.SK,
                    competitor.criterias[j].id,
                    j + 1,
                    competitor.criterias[j].type,
                    competitor.criterias[j].name,
                    competitor.criterias[j].value?.value?.toString(),
                );

                putRequests.push({
                    PutRequest: {
                        Item: criteriaEntity.toDynamoDbItem(),
                    },
                });
            }
        }

        await this.executeBatchRequests(putRequests);
        await this.projectsService.updateProjectUpdateTime(
            userPK,
            competitorAnalysisEntity.PK,
        );
    }

    public async uploadThumbnail(
        userPK: string,
        competitorAnalysisPK: string,
        competitorAnalysisSK: string,
        image: Buffer,
    ): Promise<void> {
        const competitorAnalysisEntity = await this.findOne(
            userPK,
            competitorAnalysisPK,
            competitorAnalysisSK,
        );

        const objectKey = `competitor-analysis-thumbnails/${userPK}/${v4()}${new Date().getTime()}.jpg`;

        await this.saveImageToS3(image, objectKey);

        await this.updateThumbnailPathInFeature(
            competitorAnalysisEntity.PK,
            competitorAnalysisEntity.SK,
            objectKey,
        );

        await this.projectsService.updateCompetitorAnalysisThumbnailPath(
            userPK,
            competitorAnalysisEntity.PK,
            objectKey,
        );
    }

    public async deleteOne(
        userPK: string,
        PK: string,
        SK: string,
    ): Promise<void> {
        const competitorAnalysisEntity = await this.findOne(userPK, PK, SK);

        const command = new DeleteCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
        });

        await this.cleanupAllCompetitors(competitorAnalysisEntity);
        await this.dynamoDbClientService.getClient().send(command);
    }

    public mapEntityToResponseDto(
        entity: CompetitorAnalysisEntity,
    ): CompetitorAnalysisResponseDto {
        const responseDto = new CompetitorAnalysisResponseDto();
        responseDto.competitors = [];

        responseDto.projectSK = entity.PK;
        responseDto.competitorAnalysisSK = entity.SK;
        responseDto.name = entity.name;

        for (const competitor of entity.competitors.sort(
            (c1, c2) => c1.order - c2.order,
        )) {
            const competitorResponseDto = new CompetitorResponseDto();
            responseDto.competitors.push(competitorResponseDto);
            competitorResponseDto.criterias = [];

            competitorResponseDto.id = competitor.SK.split('#')[1];
            competitorResponseDto.name = competitor.name;

            for (const criteria of competitor.criterias.sort(
                (cr1, cr2) => cr1.order - cr2.order,
            )) {
                const criteriaResponseDto = new CriteriaResponseDto();
                competitorResponseDto.criterias.push(criteriaResponseDto);

                criteriaResponseDto.id = criteria.SK.split('#')[1];
                criteriaResponseDto.name = criteria.name;
                criteriaResponseDto.type = criteria.type;
                criteriaResponseDto.value = new CriteriaValueResponseDto();
                criteriaResponseDto.value.value = criteria.value;
                criteriaResponseDto.value.id = criteria.SK.split('#')[1];
            }
        }

        return responseDto;
    }

    private async cleanupAllCompetitors(
        competitorAnalysis: CompetitorAnalysisEntity,
    ): Promise<void> {
        const deleteRequests = [];

        for (const competitor of competitorAnalysis.competitors) {
            deleteRequests.push({
                DeleteRequest: {
                    Key: {
                        PK: competitor.PK,
                        SK: competitor.SK,
                    },
                },
            });

            for (const criteria of competitor.criterias) {
                deleteRequests.push({
                    DeleteRequest: {
                        Key: {
                            PK: criteria.PK,
                            SK: criteria.SK,
                        },
                    },
                });
            }
        }

        await this.executeBatchRequests(deleteRequests);
    }
}
