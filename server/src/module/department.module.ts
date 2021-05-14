import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from '../web/rest/department.controller';
import { DepartmentRepository } from '../repository/department.repository';
import { DepartmentService } from '../service/department.service';
import { RoleModule } from './role.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([DepartmentRepository]), RoleModule],
    controllers: [DepartmentController],
    providers: [DepartmentService],
    exports: [DepartmentService],
})
export class DepartmentModule {}
