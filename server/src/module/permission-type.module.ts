import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionTypeController } from '../web/rest/permission-type.controller';
import { PermissionTypeRepository } from '../repository/permission-type.repository';
import { PermissionTypeService } from '../service/permission-type.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([PermissionTypeRepository])],
    controllers: [PermissionTypeController],
    providers: [PermissionTypeService],
    exports: [PermissionTypeService],
})
export class PermissionTypeModule {}
