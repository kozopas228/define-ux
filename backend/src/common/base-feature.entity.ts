import { BaseEntity } from './base.entity';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export abstract class BaseFeatureEntity extends BaseEntity {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public thumbnailPath?: string;

    protected constructor(
        pk: string,
        sk: string,
        createdAt: Date,
        updatedAt: Date,
        name: string,
    ) {
        super(pk, sk, createdAt, updatedAt);

        this.name = name;
    }
}
