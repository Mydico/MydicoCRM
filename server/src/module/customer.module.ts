import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from '../web/rest/customer.controller';
import { CustomerRepository } from '../repository/customer.repository';
import { CustomerService } from '../service/customer.service';
import { DepartmentModule } from './department.module';
import { CustomerSubscriber } from '../service/subscribers/customer.subscriber';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CustomerRepository]), DepartmentModule],
    controllers: [CustomerController],
    providers: [CustomerService, CustomerSubscriber],
    exports: [CustomerService],
})
export class CustomerModule {}
