import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../web/rest/order.controller';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from '../service/order.service';
import { ProductQuantityModule } from './product-quantity.module';
import { TransactionModule } from './transaction.module';
import { DepartmentModule } from './department.module';
import { IncomeDashboardModule } from './income-dashboard.module';
import { CustomerModule } from './customer.module';
import { OrderSubscriber } from '../service/subscribers/order.subscriber';
import { BillModule } from './bill.module';
import { EventsGateway } from './provider/events.gateway';
import { NotificationModule } from './notification.module';
import { FirebaseService } from '../service/firebase.services';
import { UserModule } from './user.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([OrderRepository]),
    forwardRef(() => BillModule),
    ProductQuantityModule,
    TransactionModule,
    DepartmentModule,
    IncomeDashboardModule,
    CustomerModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderSubscriber, EventsGateway, FirebaseService],
  exports: [OrderService]
})
export class OrderModule {}
