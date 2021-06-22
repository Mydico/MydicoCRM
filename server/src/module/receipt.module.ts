import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptController } from '../web/rest/receipt.controller';
import { ReceiptRepository } from '../repository/receipt.repository';
import { ReceiptService } from '../service/receipt.service';
import { TransactionModule } from './transaction.module';
import { IncomeDashboardModule } from './income-dashboard.module';
import { DepartmentModule } from './department.module';

@Module({
    imports: [
        CacheModule.register(),
        TypeOrmModule.forFeature([ReceiptRepository]),
        TransactionModule,
        IncomeDashboardModule,
        DepartmentModule,
    ],
    controllers: [ReceiptController],
    providers: [ReceiptService],
    exports: [ReceiptService],
})
export class ReceiptModule {}
