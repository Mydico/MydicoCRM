import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailsController } from '../web/rest/order-details.controller';
import { OrderDetailsRepository } from '../repository/order-details.repository';
import { OrderDetailsService } from '../service/order-details.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderDetailsRepository])],
    controllers: [OrderDetailsController],
    providers: [OrderDetailsService],
    exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
