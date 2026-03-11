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
import { CompetitorAnalysisEntity } from './entities/competitor-analysis.entity';
import { CreateCompetitorAnalysisDto } from './dto/create-competitor-analysis.dto';
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
import { CompetitorAnalysisService } from './competitor-analysis.service';
import { RequestWithUser } from '../common/request-with-user';
import { SimpleMessageResponse } from '../common/simple-message.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadThumbnailDto } from '../common/dto/upload-thumbnail-dto';
import { IMAGE_JPEG_REGEXP } from '../common/constants/regex.constants';
import { CompetitorAnalysisResponseDto } from './dto/competitor-analysis-response.dto';

@ApiTags('Competitor Analysis')
@ApiForbiddenResponse({
    description: 'The project does not belong to this user',
})
@ApiBearerAuth()
@Controller('competitor-analysis')
export class CompetitorAnalysisController {
    constructor(private competitorAnalysisService: CompetitorAnalysisService) {}

    @ApiOperation({ summary: 'Get all Competitor Analysis of a project' })
    @ApiOkResponse({
        description: 'Successful entities retrieval',
        type: [CompetitorAnalysisEntity],
    })
    @ApiNotFoundResponse({
        description: 'Competitor Analysis were not found',
    })
    @Get(':PK')
    public async findAllByPK(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
    ): Promise<CompetitorAnalysisEntity[]> {
        return await this.competitorAnalysisService.findAllByPK(
            req.user.PK,
            PK,
        );
    }

    @ApiOperation({ summary: 'Get one Competitor Analysis' })
    @ApiOkResponse({
        description: 'Successful entity retrieval',
        type: CompetitorAnalysisResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Competitor Analysis was not found',
    })
    @Get(':PK/:SK')
    public async findOne(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<CompetitorAnalysisResponseDto> {
        const entity = await this.competitorAnalysisService.findOne(
            req.user.PK,
            PK,
            SK,
        );

        return this.competitorAnalysisService.mapEntityToResponseDto(entity);
    }

    @ApiOperation({ summary: 'Create a new Competitor Analysis' })
    @ApiCreatedResponse({
        description: 'Successful creation of entity',
        type: CompetitorAnalysisEntity,
    })
    @Post()
    public async create(
        @Req() request: RequestWithUser,
        @Body() createDto: CreateCompetitorAnalysisDto,
    ): Promise<CompetitorAnalysisEntity> {
        return await this.competitorAnalysisService.create(
            request.user.PK,
            createDto,
        );
    }

    @ApiOperation({ summary: 'Update (save) existing Competitor Analysis' })
    @ApiOkResponse({
        description: 'Successful update',
    })
    @ApiNotFoundResponse({
        description: 'Competitor Analysis was not found',
    })
    @Patch()
    public async update(
        @Req() request: RequestWithUser,
        @Body() updateDto: CompetitorAnalysisResponseDto,
    ): Promise<SimpleMessageResponse> {
        await this.competitorAnalysisService.update(request.user.PK, updateDto);

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
        description: 'Competitor Analysis was not found',
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
        await this.competitorAnalysisService.uploadThumbnail(
            request.user.PK,
            uploadThumbnailDto.PK,
            uploadThumbnailDto.SK,
            image.buffer,
        );

        return { message: 'Image thumbnail has been successfully uploaded' };
    }

    @ApiOperation({
        summary: 'Delete existing Competitor Analysis',
    })
    @ApiNoContentResponse({
        description: 'Competitor Analysis has been removed',
    })
    @Delete(':PK/:SK')
    public async deleteOne(
        @Req() req: RequestWithUser,
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<void> {
        await this.competitorAnalysisService.deleteOne(req.user.PK, PK, SK);
    }
}
