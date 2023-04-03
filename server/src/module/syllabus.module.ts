import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyllabusController } from '../web/rest/syllabus.controller';
import { SyllabusRepository } from '../repository/syllabus.repository';
import { SyllabusService } from '../service/syllabus.service';
import { RoleModule } from './role.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([SyllabusRepository])],
    controllers: [SyllabusController],
    providers: [SyllabusService],
    exports: [SyllabusService],
})
export class SyllabusModule {}
