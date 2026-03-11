import { Module } from '@nestjs/common';
import { CompetitorAnalysisService } from './competitor-analysis.service';
import { CompetitorAnalysisController } from './competitor-analysis.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    imports: [ProjectsModule],
    providers: [CompetitorAnalysisService],
    controllers: [CompetitorAnalysisController],
})
export class CompetitorAnalysisModule {}
