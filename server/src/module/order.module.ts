import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../web/rest/order.controller';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from '../service/order.service';
import { BillModule } from './bill.module';
import { ProductQuantityModule } from './product-quantity.module';
import { TransactionModule } from './transaction.module';

@Module({
    imports: [TypeOrmModule.forFeature([OrderRepository]), BillModule, ProductQuantityModule, TransactionModule],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}
