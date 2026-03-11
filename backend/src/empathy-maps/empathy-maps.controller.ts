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
import { RequestWithUser } from '../common/request-with-user';
import { EmpathyMapsService } from './empathy-maps.service';
import { EmpathyMapEntity } from './entities/empathy-map.entity';
import { SimpleMessageResponse } from '../common/simple-message.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadThumbnailDto } from '../common/dto/upload-thumbnail-dto';
import { IMAGE_JPEG_REGEXP } from '../common/constants/regex.constants';
import { CreateEmpathyMapDto } from './dto/create-empathy-map.dto';
import { UpdateEmpathyMapDto } from './dto/update-empathy-map.dto';

@ApiTags('Empathy Maps')
@ApiForbiddenResponse({
    description: 'The project does not belong to this user',
})
@ApiBearerAuth()
@Controller('empathy-maps')
export class EmpathyMapsController {
    constructor(private empathyMapService: EmpathyMapsService) {}

    @ApiOperation({ summary: 'Get all Empathy Maps of a project' })
    @ApiOkResponse({
        description: 'Successful entities retrieval',
        type: [EmpathyMapEntity],
    })
    @ApiNotFoundResponse({
        description: 'Empathy Maps were not found',
    })
    @Get(':PK')
    public async findAllByPK(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
    ): Promise<EmpathyMapEntity[]> {
        return await this.empathyMapService.findAllByPK(req.user.PK, PK);
    }

    @ApiOperation({ summary: 'Get one Empathy Map' })
    @ApiOkResponse({
        description: 'Successful entity retrieval',
        type: EmpathyMapEntity,
    })
    @ApiNotFoundResponse({
        description: 'Empathy Map was not found',
    })
    @Get(':PK/:SK')
    public async findOne(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<EmpathyMapEntity> {
        return await this.empathyMapService.findOne(req.user.PK, PK, SK);
    }

    @ApiOperation({ summary: 'Create a new Empathy Map' })
    @ApiCreatedResponse({
        description: 'Successful creation of entity',
        type: EmpathyMapEntity,
    })
    @Post()
    public async create(
        @Req() request: RequestWithUser,
        @Body() createDto: CreateEmpathyMapDto,
    ): Promise<EmpathyMapEntity> {
        return await this.empathyMapService.create(request.user.PK, createDto);
    }

    @ApiOperation({ summary: 'Update (save) existing Empathy Map' })
    @ApiOkResponse({
        description: 'Successful update',
    })
    @ApiNotFoundResponse({
        description: 'Empathy Map was not found',
    })
    @Patch()
    public async update(
        @Req() request: RequestWithUser,
        @Body() updateDto: UpdateEmpathyMapDto,
    ): Promise<SimpleMessageResponse> {
        await this.empathyMapService.update(request.user.PK, updateDto);

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
        description: 'Empathy Map was not found',
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
                        fileType: IMAGE_JPEG_REGEXP,
                    }),
                ],
            }),
        )
        image: Express.Multer.File,
    ): Promise<SimpleMessageResponse> {
        await this.empathyMapService.uploadThumbnail(
            request.user.PK,
            uploadThumbnailDto.PK,
            uploadThumbnailDto.SK,
            image.buffer,
        );

        return { message: 'Image thumbnail has been successfully uploaded' };
    }

    @ApiOperation({
        summary: 'Delete existing Empathy Map',
    })
    @ApiNoContentResponse({
        description: 'Empathy Map has been removed',
    })
    @Delete(':PK/:SK')
    public async deleteOne(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<void> {
        await this.empathyMapService.deleteOne(req.user.PK, PK, SK);
    }
}
