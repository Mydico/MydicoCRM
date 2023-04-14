import { CacheModule, Module } from '@nestjs/common';
import { ReportController } from '../web/rest/report.controller';
import { ReportService } from '../service/report.service';
import { DepartmentModule } from './department.module';
import { OrderModule } from './order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/order.repository';
import { OrderDetailsRepository } from '../repository/order-details.repository';
import { CustomerRepository } from '../repository/customer.repository';
import { IncomeDashboardRepository } from '../repository/income-dashboard.repository';
import { DebtDashboardRepository } from '../repository/debt-dashboard.repository';
import { StoreInputRepository } from '../repository/store-input.repository';
import { StoreInputDetailsRepository } from '../repository/store-input-details.repository';
import { TransactionRepository } from '../repository/transaction.repository';
import { BillRepository } from '../repository/bill.repository';
import { StoreHistoryRepository } from '../repository/store-history.repository';
import * as redisStore from 'cache-manager-redis-store';
import { UserAnswerModule } from './user-answer.module';
import { PrivateController } from '../web/rest/report-permission.controller';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379
    }),
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderDetailsRepository,
      CustomerRepository,
      IncomeDashboardRepository,
      DebtDashboardRepository,
      StoreInputRepository,
      StoreInputDetailsRepository,
      TransactionRepository,
      BillRepository,
      StoreHistoryRepository
    ]),
    DepartmentModule,
    OrderModule,
    UserAnswerModule
  ],
  controllers: [ReportController, PrivateController],
  providers: [ReportService],
  exports: [ReportService]
})
export class ReportModule {}
