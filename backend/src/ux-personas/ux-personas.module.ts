import { Module } from '@nestjs/common';
import { UxPersonasController } from './ux-personas.controller';
import { UxPersonasService } from './ux-personas.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    imports: [ProjectsModule],
    controllers: [UxPersonasController],
    providers: [UxPersonasService],
    exports: [UxPersonasService],
})
export class UxPersonasModule {}
