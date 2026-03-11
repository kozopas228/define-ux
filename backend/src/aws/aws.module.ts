import { Module } from '@nestjs/common';
import { DynamoDbClientService } from './dynamo-db-client.service';
import { S3ClientService } from './s3-client.service';
import { SesClientService } from './ses-client.service';

@Module({})
export class AwsModule {
    public static forRoot(options: AwsModuleOptions) {
        return {
            module: AwsModule,
            providers: [
                { provide: 'AWS_MODULE_OPTIONS', useValue: options },
                DynamoDbClientService,
                S3ClientService,
                SesClientService,
            ],
            exports: [DynamoDbClientService, S3ClientService, SesClientService],
            global: true,
        };
    }
}

export type AwsModuleOptions = {
    region: string;
    s3BucketName: string;
    dynamoDbTableName: string;
};
