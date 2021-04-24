import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreInputDetailsController } from '../web/rest/store-input-details.controller';
import { StoreInputDetailsRepository } from '../repository/store-input-details.repository';
import { StoreInputDetailsService } from '../service/store-input-details.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([StoreInputDetailsRepository])],
    controllers: [StoreInputDetailsController],
    providers: [StoreInputDetailsService],
    exports: [StoreInputDetailsService],
})
export class StoreInputDetailsModule {}
