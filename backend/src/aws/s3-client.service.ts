import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { AwsModuleOptions } from './aws.module';
import { S3Client } from '@aws-sdk/client-s3';
// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class S3ClientService {
    private s3Client: S3Client;
    private logger: Logger = new Logger();

    constructor(
        @Inject('AWS_MODULE_OPTIONS') private options: AwsModuleOptions,
    ) {}

    public getClient(): S3Client {
        if (this.s3Client) {
            return this.s3Client;
        }

        this.s3Client = new S3Client();

        this.logger.log('S3 client created');

        return this.s3Client;
    }
}
