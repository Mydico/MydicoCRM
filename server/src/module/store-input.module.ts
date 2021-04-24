import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreInputController } from '../web/rest/store-input.controller';
import { StoreInputRepository } from '../repository/store-input.repository';
import { StoreInputService } from '../service/store-input.service';
import { ProductQuantityModule } from './product-quantity.module';
import { StoreHistoryModule } from './store-history.module';
import { StoreInputDetailsModule } from './store-input-details.module';
import { TransactionModule } from './transaction.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([StoreInputRepository]), ProductQuantityModule, StoreHistoryModule, StoreInputDetailsModule, TransactionModule],
    controllers: [StoreInputController],
    providers: [StoreInputService],
    exports: [StoreInputService],
})
export class StoreInputModule {}
