import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderController } from '../web/rest/provider.controller';
import { ProviderRepository } from '../repository/provider.repository';
import { ProviderService } from '../service/provider.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([ProviderRepository])],
    controllers: [ProviderController],
    providers: [ProviderService],
    exports: [ProviderService],
})
export class ProviderModule {}
