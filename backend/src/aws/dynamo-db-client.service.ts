import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { AwsModuleOptions } from './aws.module';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class DynamoDbClientService {
    private docClient: DynamoDBDocumentClient;
    private logger: Logger = new Logger();

    constructor(
        @Inject('AWS_MODULE_OPTIONS') private options: AwsModuleOptions,
    ) {}

    public getClient(): DynamoDBDocumentClient {
        if (this.docClient) {
            return this.docClient;
        }

        const client = new DynamoDBClient({});
        this.docClient = DynamoDBDocumentClient.from(client);

        this.logger.log('DB client created');

        return this.docClient;
    }
}
