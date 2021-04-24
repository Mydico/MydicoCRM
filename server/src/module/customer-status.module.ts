import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerStatusController } from '../web/rest/customer-status.controller';
import { CustomerStatusRepository } from '../repository/customer-status.repository';
import { CustomerStatusService } from '../service/customer-status.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CustomerStatusRepository])],
    controllers: [CustomerStatusController],
    providers: [CustomerStatusService],
    exports: [CustomerStatusService],
})
export class CustomerStatusModule {}
