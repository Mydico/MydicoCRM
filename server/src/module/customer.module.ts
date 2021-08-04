import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from '../web/rest/customer.controller';
import { CustomerRepository } from '../repository/customer.repository';
import { CustomerService } from '../service/customer.service';
import { DepartmentModule } from './department.module';
import { CustomerSubscriber } from '../service/subscribers/customer.subscriber';
import { TransactionModule } from './transaction.module';
import { TransactionRepository } from '../repository/transaction.repository';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CustomerRepository,TransactionRepository]), DepartmentModule, TransactionModule],
    controllers: [CustomerController],
    providers: [CustomerService, CustomerSubscriber],
    exports: [CustomerService],
})
export class CustomerModule {}
