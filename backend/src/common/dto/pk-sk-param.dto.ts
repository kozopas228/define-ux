import { IsString, Matches } from 'class-validator';
import { PK_SK_REGEX } from '../constants/regex.constants';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

export class PkSkParamDto {
    @ApiProperty({
        description: 'A string containing PK and SK separated by an underscore',
        // pattern: '^[A-Za-z0-9#]+_[A-Za-z0-9#]+$', // validation in swagger
        // example:
        //     'USER#4790fec4-0b66-48dd-bbd0-e61cfdb654e0_PROJECT#72b7187a-f547-4e70-adf7-115ac8e6ecb2',
    })
    @IsString()
    @Matches(PK_SK_REGEX, {
        message:
            "Invalid format for param. It must be in the format 'PartitionKey_SortKey'",
    })
    public PK_SK: string;
}
