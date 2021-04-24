import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRequestController } from '../web/rest/customer-request.controller';
import { CustomerRequestRepository } from '../repository/customer-request.repository';
import { CustomerRequestService } from '../service/customer-request.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CustomerRequestRepository])],
    controllers: [CustomerRequestController],
    providers: [CustomerRequestService],
    exports: [CustomerRequestService],
})
export class CustomerRequestModule {}
