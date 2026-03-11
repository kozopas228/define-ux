import { ApiProperty } from '@nestjs/swagger';

export class CreateUxPersonaDto {
    @ApiProperty()
    projectSK: string;
}
