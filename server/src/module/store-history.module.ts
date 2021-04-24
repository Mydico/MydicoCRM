import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreHistoryController } from '../web/rest/store-history.controller';
import { StoreHistoryRepository } from '../repository/store-history.repository';
import { StoreHistoryService } from '../service/store-history.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([StoreHistoryRepository])],
    controllers: [StoreHistoryController],
    providers: [StoreHistoryService],
    exports: [StoreHistoryService],
})
export class StoreHistoryModule {}
