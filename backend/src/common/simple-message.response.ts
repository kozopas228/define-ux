import { ApiProperty } from '@nestjs/swagger';

export class SimpleMessageResponse {
    @ApiProperty()
    message: string;
}
