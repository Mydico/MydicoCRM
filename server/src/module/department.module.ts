import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from '../web/rest/department.controller';
import { DepartmentRepository } from '../repository/department.repository';
import { DepartmentService } from '../service/department.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([DepartmentRepository])],
    controllers: [DepartmentController],
    providers: [DepartmentService],
    exports: [DepartmentService],
})
export class DepartmentModule {}
