import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDebitController } from '../web/rest/customer-debit.controller';
import { CustomerDebitRepository } from '../repository/customer-debit.repository';
import { CustomerDebitService } from '../service/customer-debit.service';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerDebitRepository])],
    controllers: [CustomerDebitController],
    providers: [CustomerDebitService],
    exports: [CustomerDebitService],
})
export class CustomerDebitModule {}
