import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreHistoryController } from '../web/rest/store-history.controller';
import { StoreHistoryRepository } from '../repository/store-history.repository';
import { StoreHistoryService } from '../service/store-history.service';
import { DepartmentModule } from './department.module';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379
    }),
    TypeOrmModule.forFeature([StoreHistoryRepository]),
    DepartmentModule
  ],
  controllers: [StoreHistoryController],
  providers: [StoreHistoryService],
  exports: [StoreHistoryService]
})
export class StoreHistoryModule {}
