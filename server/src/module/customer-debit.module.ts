import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDebitController } from '../web/rest/customer-debit.controller';
import { CustomerDebitRepository } from '../repository/customer-debit.repository';
import { CustomerDebitService } from '../service/customer-debit.service';
import { DepartmentModule } from './department.module';

@Module({
    imports: [CacheModule.register(), TypeOrmModule.forFeature([CustomerDebitRepository]), DepartmentModule],
    controllers: [CustomerDebitController],
    providers: [CustomerDebitService],
    exports: [CustomerDebitService],
})
export class CustomerDebitModule {}
