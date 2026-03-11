import { Module } from '@nestjs/common';
import { EmpathyMapsService } from './empathy-maps.service';
import { EmpathyMapsController } from './empathy-maps.controller';
import { ProjectsModule } from '../projects/projects.module';
import { UxPersonasModule } from '../ux-personas/ux-personas.module';

@Module({
    imports: [ProjectsModule, UxPersonasModule],
    providers: [EmpathyMapsService],
    controllers: [EmpathyMapsController],
})
export class EmpathyMapsModule {}
