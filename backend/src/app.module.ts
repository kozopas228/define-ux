import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UxPersonasModule } from './ux-personas/ux-personas.module';
import { EmpathyMapsModule } from './empathy-maps/empathy-maps.module';
import { CompetitorAnalysisModule } from './competitor-analysis/competitor-analysis.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        AwsModule.forRoot({
            region: process.env.AWS_APP_REGION!,
            s3BucketName: process.env.AWS_S3_BUCKET!,
            dynamoDbTableName: process.env.AWS_DYNAMODB_TABLE!,
        }),
        UxPersonasModule,
        EmpathyMapsModule,
        CompetitorAnalysisModule,
        UsersModule,
        AuthModule,
        ProjectsModule,
    ],
})
export class AppModule {}
