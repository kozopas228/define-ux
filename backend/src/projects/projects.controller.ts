import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { RequestWithUser } from '../common/request-with-user';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entities/project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SimpleMessageResponse } from '../common/simple-message.response';
import { PkSkParamDto } from '../common/dto/pk-sk-param.dto';
import { Validator } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @ApiOperation({
        summary: 'Get all Projects',
        description: 'Return all project of current user.',
    })
    @ApiOkResponse({
        description: 'Successful projects retrieving.',
        type: [ProjectEntity],
    })
    @Get()
    public async findAll(
        @Req() request: RequestWithUser,
    ): Promise<ProjectEntity[]> {
        return await this.projectsService.findAll(request.user.PK);
    }

    @ApiOperation({
        summary: 'Get one Project',
    })
    @ApiOkResponse({
        description: 'Successful project retrieving.',
        type: ProjectEntity,
    })
    @ApiNotFoundResponse({
        description: 'Project was not found.',
    })
    @Get(':PK/:SK')
    public async findOne(
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<ProjectEntity> {
        return await this.projectsService.findOne(PK, SK);
    }

    @ApiOperation({
        summary: 'Create a new Project',
    })
    @ApiCreatedResponse({
        description: 'Successful project creation.',
        type: ProjectEntity,
    })
    @Post()
    public async create(
        @Req() request: RequestWithUser,
    ): Promise<ProjectEntity> {
        return await this.projectsService.create(request.user.PK);
    }

    @ApiOperation({
        summary: 'Update (save) existing Project',
    })
    @ApiOkResponse({
        description: 'Successful project update.',
        type: SimpleMessageResponse,
    })
    @ApiNotFoundResponse({
        description: 'Project does not exist',
    })
    @Patch()
    public async update(
        @Req() request: RequestWithUser,
        @Body() updateProjectDto: UpdateProjectDto,
    ): Promise<SimpleMessageResponse> {
        await this.projectsService.update(request.user.PK, updateProjectDto);

        return { message: 'Project has been successfully updated' };
    }

    @ApiOperation({
        summary: 'Delete existing Project',
    })
    @ApiNoContentResponse({
        description: 'Successful project deletion.',
        type: SimpleMessageResponse,
    })
    @ApiNotFoundResponse({
        description: 'Project does not exist',
    })
    @Delete(':PK/:SK')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<void> {
        await this.projectsService.deleteOne(PK, SK);
    }
}
