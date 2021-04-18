import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from '../web/rest/transaction.controller';
import { TransactionRepository } from '../repository/transaction.repository';
import { TransactionService } from '../service/transaction.service';
import { TransactionSubscriber } from '../service/subscribers/transaction.subscriber';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionRepository])],
    controllers: [TransactionController],
    providers: [TransactionService, TransactionSubscriber],
    exports: [TransactionService],
})
export class TransactionModule {}
