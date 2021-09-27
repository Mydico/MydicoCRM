import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from '../web/rest/customer.controller';
import { CustomerRepository } from '../repository/customer.repository';
import { CustomerService } from '../service/customer.service';
import { DepartmentModule } from './department.module';
import { CustomerSubscriber } from '../service/subscribers/customer.subscriber';
import { TransactionModule } from './transaction.module';
import { TransactionRepository } from '../repository/transaction.repository';
import { OrderRepository } from '../repository/order.repository';
import { StoreInputRepository } from '../repository/store-input.repository';
import { ReceiptRepository } from '../repository/receipt.repository';
import { BillRepository } from '../repository/bill.repository';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CustomerRepository,TransactionRepository, OrderRepository, StoreInputRepository, ReceiptRepository, BillRepository]), DepartmentModule, TransactionModule, HttpModule],
    controllers: [CustomerController],
    providers: [CustomerService, CustomerSubscriber],
    exports: [CustomerService],
})
export class CustomerModule {}
