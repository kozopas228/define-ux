import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenPairResponse {
    @ApiProperty()
    public access_token: string;

    public refresh_token: string;
}
