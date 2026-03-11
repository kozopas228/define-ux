import { ApiProperty } from '@nestjs/swagger';

export class UploadThumbnailDto {
    @ApiProperty()
    public PK: string;

    @ApiProperty()
    public SK: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    public image: Express.Multer.File;
}
