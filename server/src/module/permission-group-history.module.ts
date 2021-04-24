import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroupHistoryController } from '../web/rest/permission-group-history.controller';
import { PermissionGroupHistoryRepository } from '../repository/permission-group-history.repository';
import { PermissionGroupHistoryService } from '../service/permission-group-history.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([PermissionGroupHistoryRepository])],
    controllers: [PermissionGroupHistoryController],
    providers: [PermissionGroupHistoryService],
    exports: [PermissionGroupHistoryService],
})
export class PermissionGroupHistoryModule {}
