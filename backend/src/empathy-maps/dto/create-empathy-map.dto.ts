import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpathyMapDto {
    @ApiProperty()
    projectSK: string;
}
