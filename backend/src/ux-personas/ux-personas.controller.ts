import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { UxPersonasService } from './ux-personas.service';
import { RequestWithUser } from '../common/request-with-user';
import { UxPersonaEntity } from './entities/ux-persona.entity';
import { CreateUxPersonaDto } from './dto/create-ux-persona.dto';
import { UxPersonaResponseDto } from './dto/ux-persona-response.dto';
import { SimpleMessageResponse } from '../common/simple-message.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadThumbnailDto } from '../common/dto/upload-thumbnail-dto';
import { IMAGE_JPEG_REGEXP, IMAGE_REGEXP } from "../common/constants/regex.constants";

@ApiTags('UX Personas')
@ApiForbiddenResponse({
    description: 'The project does not belong to this user',
})
@ApiBearerAuth()
@Controller('ux-personas')
export class UxPersonasController {
    constructor(private uxPersonasService: UxPersonasService) {}

    @ApiOperation({ summary: 'Get all UX Personas of a project' })
    @ApiOkResponse({
        description: 'Successful entities retrieval',
        type: [UxPersonaEntity],
    })
    @ApiNotFoundResponse({
        description: 'UX Personas were not found',
    })
    @Get(':PK')
    public async findAllByPK(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
    ): Promise<UxPersonaEntity[]> {
        return await this.uxPersonasService.findAllByPK(req.user.PK, PK);
    }

    @ApiOperation({ summary: 'Get one UX Persona' })
    @ApiOkResponse({
        description: 'Successful entity retrieval',
        type: UxPersonaResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'UX Persona was not found',
    })
    @Get(':PK/:SK')
    public async findOne(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<UxPersonaResponseDto> {
        const entity = await this.uxPersonasService.findOne(
            req.user.PK,
            PK,
            SK,
        );

        const response = this.uxPersonasService.mapEntityToResponseDto(entity);

        return response;
    }

    @ApiOperation({ summary: 'Create a new UX Persona' })
    @ApiCreatedResponse({
        description: 'Successful creation of entity',
        type: UxPersonaEntity,
    })
    @Post()
    public async create(
        @Req() request: RequestWithUser,
        @Body() createDto: CreateUxPersonaDto,
    ): Promise<UxPersonaEntity> {
        return await this.uxPersonasService.create(request.user.PK, createDto);
    }

    @ApiOperation({ summary: 'Update (save) existing UX Persona' })
    @ApiOkResponse({
        description: 'Successful update',
    })
    @ApiNotFoundResponse({
        description: 'UX Persona was not found',
    })
    @Patch()
    public async update(
        @Req() request: RequestWithUser,
        @Body() updateDto: UxPersonaResponseDto,
    ): Promise<SimpleMessageResponse> {
        await this.uxPersonasService.update(request.user.PK, updateDto);

        return { message: 'Competitor Analysis has been successfully updated' };
    }

    @ApiOperation({
        summary: 'Upload thumbnail image',
        description: 'Uploads both image of entity and project',
    })
    @ApiOkResponse({
        description: 'Successful upload',
    })
    @ApiNotFoundResponse({
        description: 'UX Persona was not found',
    })
    @ApiConsumes('multipart/form-data')
    @Post('/upload-thumbnail')
    @UseInterceptors(FileInterceptor('image'))
    public async uploadThumbnail(
        @Req() request: RequestWithUser,
        @Body() uploadThumbnailDto: UploadThumbnailDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: IMAGE_REGEXP,
                    }),
                ],
            }),
        )
        image: Express.Multer.File,
    ): Promise<SimpleMessageResponse> {
        await this.uxPersonasService.uploadThumbnail(
            request.user.PK,
            uploadThumbnailDto.PK,
            uploadThumbnailDto.SK,
            image.buffer,
        );

        return { message: 'Image thumbnail has been successfully uploaded' };
    }

    @ApiOperation({
        summary: 'Delete existing UX Persona',
    })
    @ApiNoContentResponse({
        description: 'UX Persona has been removed',
    })
    @Delete(':PK/:SK')
    public async deleteOne(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<void> {
        await this.uxPersonasService.deleteOne(req.user.PK, PK, SK);
    }

    @ApiOperation({
        summary: 'Delete existing UX Persona',
    })
    @Get('thumbnailUrl/:PK/:SK')
    public async getThumbnailUrl(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<string | undefined> {
        return await this.uxPersonasService.getThumbnailUrl(
            req.user.PK,
            PK,
            SK,
        );
    }
}
