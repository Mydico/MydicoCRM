import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from '../web/rest/store.controller';
import { StoreRepository } from '../repository/store.repository';
import { StoreService } from '../service/store.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([StoreRepository])],
    controllers: [StoreController],
    providers: [StoreService],
    exports: [StoreService],
})
export class StoreModule {}
