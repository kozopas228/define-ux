import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetitorAnalysisDto {
    @ApiProperty()
    projectSK: string;
}
