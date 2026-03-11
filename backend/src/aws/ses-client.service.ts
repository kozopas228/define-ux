import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { AwsModuleOptions } from './aws.module';
import { SESClient } from '@aws-sdk/client-ses';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class SesClientService {
    private sesClient: SESClient;
    private logger: Logger = new Logger();

    constructor(
        @Inject('AWS_MODULE_OPTIONS') private options: AwsModuleOptions,
    ) {}

    public getClient(): SESClient {
        if (this.sesClient) {
            return this.sesClient;
        }

        this.sesClient = new SESClient();

        this.logger.log('SES client created');

        return this.sesClient;
    }
}
