import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCallController } from '../web/rest/customer-call.controller';
import { CustomerCallRepository } from '../repository/customer-call.repository';
import { CustomerCallService } from '../service/customer-call.service';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerCallRepository])],
    controllers: [CustomerCallController],
    providers: [CustomerCallService],
    exports: [CustomerCallService],
})
export class CustomerCallModule {}
