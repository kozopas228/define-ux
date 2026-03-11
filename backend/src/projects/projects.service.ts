import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { ConfigService } from '@nestjs/config';
import {
    DeleteCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { BaseService } from '../common/base.service';
import { ProjectEntity } from './entities/project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SesClientService } from '../aws/ses-client.service';
import { MAX_PROJECTS_COUNT } from '../common/constants/validations.constants';

@Injectable()
export class ProjectsService extends BaseService {
    constructor(
        dynamoDbClientService: DynamoDbClientService,
        s3ClientService: S3ClientService,
        configService: ConfigService,
        sesClientService: SesClientService,
    ) {
        super(
            dynamoDbClientService,
            s3ClientService,
            sesClientService,
            configService,
        );
    }

    public async findOne(PK: string, SK: string): Promise<ProjectEntity> {
        if (!(await this.doesProjectBelongToUser(PK, SK))) {
            throw new ForbiddenException(
                'The project does not belong to this user',
            );
        }

        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':sk': SK,
                ':type': ProjectEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        if (!response.Items || response.Items.length === 0) {
            throw new NotFoundException('Project was not found');
        }

        return response.Items[0] as ProjectEntity;
    }

    public async findAll(PK: string): Promise<ProjectEntity[]> {
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':type': ProjectEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        const entities = response.Items as ProjectEntity[];

        for (const entity of entities) {
            entity.competitorAnalysisThumbnailPath = await this.getS3SignedUrl(
                entity.competitorAnalysisThumbnailPath,
            );

            entity.empathyMapThumbnailPath = await this.getS3SignedUrl(
                entity.empathyMapThumbnailPath,
            );

            entity.uxPersonaThumbnailPath = await this.getS3SignedUrl(
                entity.uxPersonaThumbnailPath,
            );
        }

        return entities;
    }

    public async create(PK: string): Promise<ProjectEntity> {
        const newEntity = ProjectEntity.build(PK);

        if (
            await this.doesEntityExist(
                newEntity.PK,
                newEntity.SK,
                ProjectEntity.entityType,
            )
        ) {
            throw new ConflictException(
                'Item with this properties already exists.',
            );
        }

        const allUserProjects = await this.findAll(PK);
        if (allUserProjects.length >= MAX_PROJECTS_COUNT) {
            throw new BadRequestException(
                'Maximum projects count per user exceeds',
            );
        }

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: newEntity.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);

        return newEntity;
    }

    public async update(
        PK: string,
        updateProjectDto: UpdateProjectDto,
    ): Promise<void> {
        if (
            !(await this.doesEntityExist(
                PK,
                updateProjectDto.SK,
                ProjectEntity.entityType,
            ))
        ) {
            throw new NotFoundException('Project does not exist');
        }

        if (!(await this.doesProjectBelongToUser(PK, updateProjectDto.SK))) {
            throw new ForbiddenException(
                'The project does not belong to this user',
            );
        }

        const updateNameCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: updateProjectDto.SK,
            },
            UpdateExpression:
                'SET #nameAttribute = :projectName, UPDATED_AT = :updAt',
            ExpressionAttributeNames: {
                '#nameAttribute': 'name',
            },
            ExpressionAttributeValues: {
                ':projectName': updateProjectDto.name,
                ':updAt': new Date().getTime(),
            },
            ReturnValues: 'ALL_NEW',
        });

        const updateDescriptionCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: updateProjectDto.SK,
            },
            UpdateExpression:
                'SET description = :description, UPDATED_AT = :updAt',
            ExpressionAttributeValues: {
                ':description': updateProjectDto.description,
                ':updAt': new Date().getTime(),
            },
            ReturnValues: 'ALL_NEW',
        });

        if (updateProjectDto.name) {
            await this.dynamoDbClientService
                .getClient()
                .send(updateNameCommand);
        }

        if (updateProjectDto.description) {
            await this.dynamoDbClientService
                .getClient()
                .send(updateDescriptionCommand);
        }
    }

    public async updateCompetitorAnalysisThumbnailPath(
        projectPK: string,
        projectSK: string,
        objectKey: string,
    ): Promise<void> {
        if (!(await this.doesProjectBelongToUser(projectPK, projectSK))) {
            throw new ForbiddenException(
                'The project does not belong to this user',
            );
        }

        const dynamoDbClient = this.dynamoDbClientService.getClient();

        const updateCompetitorAnalysisCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: projectPK,
                SK: projectSK,
            },
            UpdateExpression:
                'set competitorAnalysisThumbnailPath = :thumbnailPathValue',
            ExpressionAttributeValues: {
                ':thumbnailPathValue': objectKey,
            },
        });

        await dynamoDbClient.send(updateCompetitorAnalysisCommand);
    }

    public async updateUxPersonaThumbnailPath(
        projectPK: string,
        projectSK: string,
        objectKey: string,
    ): Promise<void> {
        const dynamoDbClient = this.dynamoDbClientService.getClient();

        const updateCompetitorAnalysisCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: projectPK,
                SK: projectSK,
            },
            UpdateExpression:
                'set uxPersonaThumbnailPath = :thumbnailPathValue',
            ExpressionAttributeValues: {
                ':thumbnailPathValue': objectKey,
            },
        });

        await dynamoDbClient.send(updateCompetitorAnalysisCommand);
    }

    public async updateEmpathyMapThumbnailPath(
        projectPK: string,
        projectSK: string,
        objectKey: string,
    ): Promise<void> {
        const dynamoDbClient = this.dynamoDbClientService.getClient();

        const updateCompetitorAnalysisCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: projectPK,
                SK: projectSK,
            },
            UpdateExpression:
                'set empathyMapThumbnailPath = :thumbnailPathValue',
            ExpressionAttributeValues: {
                ':thumbnailPathValue': objectKey,
            },
        });

        await dynamoDbClient.send(updateCompetitorAnalysisCommand);
    }

    public async deleteOne(PK: string, SK: string): Promise<void> {
        if (!(await this.doesEntityExist(PK, SK, ProjectEntity.entityType))) {
            throw new NotFoundException('Project does not exist');
        }

        if (!(await this.doesProjectBelongToUser(PK, SK))) {
            throw new ForbiddenException(
                'The project does not belong to this user',
            );
        }

        const command = new DeleteCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    public async doesProjectBelongToUser(
        userPK: string,
        projectSK: string,
    ): Promise<boolean> {
        const docClient = this.dynamoDbClientService.getClient();
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': userPK,
                ':sk': projectSK,
                ':type': ProjectEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await docClient.send(command);

        if (!response.Items) {
            return false;
        }

        return response.Items.length > 0;
    }

    public async checkProjectBelongPermission(
        userPK: string,
        projectSK: string,
    ): Promise<void> {
        if (!(await this.doesProjectBelongToUser(userPK, projectSK))) {
            throw new ForbiddenException(
                'The project does not belong to this user',
            );
        }
    }

    public async updateProjectUpdateTime(
        PK: string,
        SK: string,
    ): Promise<void> {
        const updateTimeCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
            UpdateExpression: 'SET UPDATED_AT = :updAt',
            ExpressionAttributeValues: {
                ':updAt': new Date().getTime(),
            },
        });

        await this.dynamoDbClientService.getClient().send(updateTimeCommand);
    }
}
