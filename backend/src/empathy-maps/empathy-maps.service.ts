import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';
import { EmpathyMapEntity } from './entities/empathy-map.entity';
import { CreateEmpathyMapDto } from './dto/create-empathy-map.dto';
import { DeleteCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { UpdateEmpathyMapDto } from './dto/update-empathy-map.dto';
import { UxPersonasService } from '../ux-personas/ux-personas.service';
import { v4 } from 'uuid';
import { SesClientService } from '../aws/ses-client.service';
import { MAX_FEATURES_COUNT } from '../common/constants/validations.constants';

@Injectable()
export class EmpathyMapsService extends BaseService {
    constructor(
        dynamoDbClientService: DynamoDbClientService,
        s3ClientService: S3ClientService,
        configService: ConfigService,
        sesClientService: SesClientService,
        private projectsService: ProjectsService,
        private uxPersonasService: UxPersonasService,
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
    ): Promise<EmpathyMapEntity> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entity = await this.findEntity<EmpathyMapEntity>(
            PK,
            SK,
            EmpathyMapEntity.entityType,
            'Empathy Map',
        );

        entity.thumbnailPath = await this.getS3SignedUrl(entity.thumbnailPath);

        return entity;
    }

    public async findAllByPK(
        userPK: string,
        PK: string,
    ): Promise<EmpathyMapEntity[]> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entities = await this.findEntities<EmpathyMapEntity>(
            PK,
            EmpathyMapEntity.entityType,
        );

        if (!entities || entities.length === 0) {
            throw new NotFoundException('Empathy Maps were not found');
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
        createDto: CreateEmpathyMapDto,
    ): Promise<EmpathyMapEntity> {
        const newEntity = EmpathyMapEntity.build(createDto.projectSK);

        if (
            await this.doesEntityExist(
                newEntity.PK,
                newEntity.SK,
                EmpathyMapEntity.entityType,
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
            const allUserEmpathyMapsPerCurrentProject = await this.findAllByPK(
                userPK,
                createDto.projectSK,
            );

            if (
                allUserEmpathyMapsPerCurrentProject.length >= MAX_FEATURES_COUNT
            ) {
                throw new BadRequestException(
                    'Maximum Empathy Maps count per project exceeds',
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
        updateDto: UpdateEmpathyMapDto,
    ): Promise<void> {
        const empathyMapEntity = await this.findOne(
            userPK,
            updateDto.projectSK,
            updateDto.empathyMapSK,
        );

        const newEmpathyMapEntity = EmpathyMapEntity.build(updateDto.projectSK);

        newEmpathyMapEntity.PK = empathyMapEntity.PK;
        newEmpathyMapEntity.SK = empathyMapEntity.SK;
        newEmpathyMapEntity.CREATED_AT = new Date(empathyMapEntity.CREATED_AT);
        newEmpathyMapEntity.UPDATED_AT = new Date();
        newEmpathyMapEntity.name = updateDto.name;
        newEmpathyMapEntity.says = updateDto.says;
        newEmpathyMapEntity.does = updateDto.does;
        newEmpathyMapEntity.thinks = updateDto.thinks;
        newEmpathyMapEntity.feels = updateDto.feels;
        newEmpathyMapEntity.pains = updateDto.pains;
        newEmpathyMapEntity.gains = updateDto.gains;

        if (updateDto.personaSK) {
            const persona = await this.uxPersonasService.findOne(
                userPK,
                updateDto.projectSK,
                updateDto.personaSK,
            );
            newEmpathyMapEntity.personaSK = persona.SK;
        }

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: newEmpathyMapEntity.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);

        await this.projectsService.updateProjectUpdateTime(
            userPK,
            empathyMapEntity.PK,
        );
    }

    public async uploadThumbnail(
        userPK: string,
        empathyMapPK: string,
        empathyMapSK: string,
        image: Buffer,
    ): Promise<void> {
        const empathyMapEntity = await this.findOne(
            userPK,
            empathyMapPK,
            empathyMapSK,
        );

        const objectKey = `empathy-maps-thumbnails/${userPK}/${v4()}${new Date().getTime()}.jpg`;

        await this.saveImageToS3(image, objectKey);

        await this.updateThumbnailPathInFeature(
            empathyMapEntity.PK,
            empathyMapEntity.SK,
            objectKey,
        );

        await this.projectsService.updateEmpathyMapThumbnailPath(
            userPK,
            empathyMapEntity.PK,
            objectKey,
        );
    }

    public async deleteOne(
        userPK: string,
        PK: string,
        SK: string,
    ): Promise<void> {
        // workaround to throw an exception if entity is not found
        const empathyMapEntity = await this.findOne(userPK, PK, SK);

        const command = new DeleteCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
        });

        await this.dynamoDbClientService.getClient().send(command);
    }
}
