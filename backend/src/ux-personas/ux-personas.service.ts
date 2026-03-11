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
import { ProjectsService } from '../projects/projects.service';
import { BaseService } from '../common/base.service';
import { UxPersonaEntity } from './entities/ux-persona.entity';
import {
    BatchWriteCommand,
    DeleteCommand,
    PutCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { PersonaSkillEntity } from './entities/persona-skill.entity';
import { PersonaMotivationEntity } from './entities/persona-motivation.entity';
import { CreateUxPersonaDto } from './dto/create-ux-persona.dto';
import {
    PersonaMotivationDto,
    PersonaSkillDto,
    UxPersonaResponseDto,
} from './dto/ux-persona-response.dto';
import { v4 } from 'uuid';
import { SesClientService } from '../aws/ses-client.service';
import { MAX_FEATURES_COUNT } from '../common/constants/validations.constants';

@Injectable()
export class UxPersonasService extends BaseService {
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
    ): Promise<UxPersonaEntity> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entity = await this.findEntity<UxPersonaEntity>(
            PK,
            SK,
            UxPersonaEntity.entityType,
            'UX Persona',
        );

        entity.thumbnailPath = await this.getS3SignedUrl(entity.thumbnailPath);

        entity.skills = await this.findEntities<PersonaSkillEntity>(
            entity.SK,
            PersonaSkillEntity.entityType,
        );

        entity.motivations = await this.findEntities<PersonaMotivationEntity>(
            entity.SK,
            PersonaMotivationEntity.entityType,
        );

        return entity;
    }

    public async getThumbnailUrl(
        userPK: string,
        PK: string,
        SK: string,
    ): Promise<string | undefined> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entity = await this.findEntity<UxPersonaEntity>(
            PK,
            SK,
            UxPersonaEntity.entityType,
            'UX Persona',
        );

        return await this.getS3SignedUrl(entity.thumbnailPath);
    }

    public async getUnsignedThumbnailUrl(
        userPK: string,
        PK: string,
        SK: string,
    ): Promise<string | undefined> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entity = await this.findEntity<UxPersonaEntity>(
            PK,
            SK,
            UxPersonaEntity.entityType,
            'UX Persona',
        );

        return entity.thumbnailPath;
    }

    public async findAllByPK(
        userPK: string,
        PK: string,
    ): Promise<UxPersonaEntity[]> {
        await this.projectsService.checkProjectBelongPermission(userPK, PK);

        const entities = await this.findEntities<UxPersonaEntity>(
            PK,
            UxPersonaEntity.entityType,
        );

        if (!entities || entities.length === 0) {
            throw new NotFoundException('UX Personas were not found');
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
        createDto: CreateUxPersonaDto,
    ): Promise<UxPersonaEntity> {
        const newEntity = UxPersonaEntity.build(createDto.projectSK);

        if (
            await this.doesEntityExist(
                newEntity.PK,
                newEntity.SK,
                UxPersonaEntity.entityType,
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
            const allUserUxPersonasPerCurrentProject = await this.findAllByPK(
                userPK,
                createDto.projectSK,
            );

            if (
                allUserUxPersonasPerCurrentProject.length >= MAX_FEATURES_COUNT
            ) {
                throw new BadRequestException(
                    'Maximum UX Personas count per project exceeds',
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
        updateDto: UxPersonaResponseDto,
    ): Promise<void> {
        const uxPersonaEntity = await this.findOne(
            userPK,
            updateDto.projectSK,
            updateDto.uxPersonaSK,
        );

        await this.cleanUpAllSkillsMotivations(uxPersonaEntity);

        const newUxPersonaEntity = UxPersonaEntity.build(updateDto.projectSK);

        newUxPersonaEntity.PK = uxPersonaEntity.PK;
        newUxPersonaEntity.SK = uxPersonaEntity.SK;
        newUxPersonaEntity.CREATED_AT = new Date(uxPersonaEntity.CREATED_AT);
        newUxPersonaEntity.UPDATED_AT = new Date();
        newUxPersonaEntity.name = updateDto.name;
        newUxPersonaEntity.personality = updateDto.personality;
        newUxPersonaEntity.hasDescription = updateDto.hasDescription;
        newUxPersonaEntity.hasPersonality = updateDto.hasPersonality;
        newUxPersonaEntity.demographics_age = updateDto.demographics_age;
        newUxPersonaEntity.demographics_gender = updateDto.demographics_gender;
        newUxPersonaEntity.demographics_occupation =
            updateDto.demographics_occupation;
        newUxPersonaEntity.hasDemographics_occupation =
            updateDto.hasDemographics_occupation;
        newUxPersonaEntity.demographics_income = updateDto.demographics_income;
        newUxPersonaEntity.hasDemographics_income =
            updateDto.hasDemographics_income;
        newUxPersonaEntity.demographics_location =
            updateDto.demographics_location;
        newUxPersonaEntity.hasDemographics_location =
            updateDto.hasDemographics_location;
        newUxPersonaEntity.personality_introvert_extrovert =
            updateDto.personality_introvert_extrovert;
        newUxPersonaEntity.hasPersonality_introvert_extrovert =
            updateDto.hasPersonality_introvert_extrovert;
        newUxPersonaEntity.personality_thinking_feeling =
            updateDto.personality_thinking_feeling;
        newUxPersonaEntity.hasPersonality_thinking_feeling =
            updateDto.hasPersonality_thinking_feeling;
        newUxPersonaEntity.personality_sensing_intuition =
            updateDto.personality_sensing_intuition;
        newUxPersonaEntity.hasPersonality_sensing_intuition =
            updateDto.hasPersonality_sensing_intuition;
        newUxPersonaEntity.personality_judging_perceiving =
            updateDto.personality_judging_perceiving;
        newUxPersonaEntity.hasPersonality_judging_perceiving =
            updateDto.hasPersonality_judging_perceiving;
        newUxPersonaEntity.biography = updateDto.biography;
        newUxPersonaEntity.goals = updateDto.goals;
        newUxPersonaEntity.frustrations = updateDto.frustrations;
        newUxPersonaEntity.hasGoals_frustrations =
            updateDto.hasGoals_frustrations;
        newUxPersonaEntity.hasSkills = updateDto.hasSkills;
        newUxPersonaEntity.hasMotivations = updateDto.hasMotivations;

        newUxPersonaEntity.thumbnailPath = await this.getUnsignedThumbnailUrl(
            userPK,
            updateDto.projectSK,
            updateDto.uxPersonaSK,
        );

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: newUxPersonaEntity.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);

        const putRequests = [];
        for (let i = 0; i < updateDto.skills.length; i++) {
            const entity = PersonaSkillEntity.build(
                updateDto.uxPersonaSK,
                i + 1,
                updateDto.skills[i].id,
                updateDto.skills[i].level,
                updateDto.skills[i].name,
            );

            putRequests.push({
                PutRequest: {
                    Item: entity.toDynamoDbItem(),
                },
            });
        }

        for (let i = 0; i < updateDto.motivations.length; i++) {
            const entity = PersonaMotivationEntity.build(
                updateDto.uxPersonaSK,
                i + 1,
                updateDto.motivations[i].id,
                updateDto.motivations[i].level,
                updateDto.motivations[i].name,
            );

            putRequests.push({
                PutRequest: {
                    Item: entity.toDynamoDbItem(),
                },
            });
        }

        await this.executeBatchRequests(putRequests);

        await this.projectsService.updateProjectUpdateTime(
            userPK,
            uxPersonaEntity.PK,
        );
    }

    public async uploadThumbnail(
        userPK: string,
        uxPersonaPK: string,
        uxPersonaSK: string,
        image: Buffer,
    ): Promise<void> {
        const uxPersonaEntity = await this.findOne(
            userPK,
            uxPersonaPK,
            uxPersonaSK,
        );

        const objectKey = `ux-personas-thumbnails/${userPK}/${v4()}${new Date().getTime()}.jpg`;

        await this.saveImageToS3(image, objectKey);

        await this.updateThumbnailPathInFeature(
            uxPersonaEntity.PK,
            uxPersonaEntity.SK,
            objectKey,
        );

        await this.projectsService.updateUxPersonaThumbnailPath(
            userPK,
            uxPersonaEntity.PK,
            objectKey,
        );
    }

    public async deleteOne(
        userPK: string,
        PK: string,
        SK: string,
    ): Promise<void> {
        const uxPersonaEntity = await this.findOne(userPK, PK, SK);

        const command = new DeleteCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
        });

        await this.cleanUpAllSkillsMotivations(uxPersonaEntity);
        await this.dynamoDbClientService.getClient().send(command);
    }

    public mapEntityToResponseDto(
        entity: UxPersonaEntity,
    ): UxPersonaResponseDto {
        const responseDto = new UxPersonaResponseDto();

        responseDto.projectSK = entity.PK;
        responseDto.uxPersonaSK = entity.SK;
        responseDto.name = entity.name;
        responseDto.personality = entity.personality;
        responseDto.hasDescription = entity.hasDescription;
        responseDto.hasPersonality = entity.hasPersonality;
        responseDto.demographics_age = entity.demographics_age;
        responseDto.demographics_gender = entity.demographics_gender;
        responseDto.demographics_occupation = entity.demographics_occupation;
        responseDto.hasDemographics_occupation =
            entity.hasDemographics_occupation;
        responseDto.demographics_income = entity.demographics_income;
        responseDto.hasDemographics_income = entity.hasDemographics_income;
        responseDto.demographics_location = entity.demographics_location;
        responseDto.hasDemographics_location = entity.hasDemographics_location;
        responseDto.personality_introvert_extrovert =
            entity.personality_introvert_extrovert;
        responseDto.hasPersonality_introvert_extrovert =
            entity.hasPersonality_introvert_extrovert;
        responseDto.personality_thinking_feeling =
            entity.personality_thinking_feeling;
        responseDto.hasPersonality_thinking_feeling =
            entity.hasPersonality_thinking_feeling;
        responseDto.personality_sensing_intuition =
            entity.personality_sensing_intuition;
        responseDto.hasPersonality_sensing_intuition =
            entity.hasPersonality_sensing_intuition;
        responseDto.personality_judging_perceiving =
            entity.personality_judging_perceiving;
        responseDto.hasPersonality_judging_perceiving =
            entity.hasPersonality_judging_perceiving;
        responseDto.biography = entity.biography;
        responseDto.goals = entity.goals;
        responseDto.frustrations = entity.frustrations;
        responseDto.hasGoals_frustrations = entity.hasGoals_frustrations;
        responseDto.hasSkills = entity.hasSkills;
        responseDto.hasMotivations = entity.hasMotivations;
        responseDto.skills = [];
        responseDto.motivations = [];

        // responseDto.thumbnailPath = entity.thumbnailPath;

        for (const skill of entity.skills.sort(
            (s1, s2) => s1.order - s2.order,
        )) {
            const personaSkillDto = new PersonaSkillDto();
            personaSkillDto.id = skill.SK.split('#')[1];
            personaSkillDto.name = skill.name;
            personaSkillDto.level = skill.level;

            responseDto.skills.push(personaSkillDto);
        }

        for (const motivation of entity.motivations.sort(
            (s1, s2) => s1.order - s2.order,
        )) {
            const personaMotivationDto = new PersonaMotivationDto();
            personaMotivationDto.id = motivation.SK.split('#')[1];
            personaMotivationDto.name = motivation.name;
            personaMotivationDto.level = motivation.level;

            responseDto.motivations.push(personaMotivationDto);
        }

        return responseDto;
    }

    private async cleanUpAllSkillsMotivations(
        uxPersonaEntity: UxPersonaEntity,
    ): Promise<void> {
        const deleteRequests = [];

        for (const skill of uxPersonaEntity.skills) {
            deleteRequests.push({
                DeleteRequest: {
                    Key: {
                        PK: skill.PK,
                        SK: skill.SK,
                    },
                },
            });
        }

        for (const motivation of uxPersonaEntity.motivations) {
            deleteRequests.push({
                DeleteRequest: {
                    Key: {
                        PK: motivation.PK,
                        SK: motivation.SK,
                    },
                },
            });
        }

        await this.executeBatchRequests(deleteRequests);
    }
}
