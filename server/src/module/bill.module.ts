import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from '../web/rest/bill.controller';
import { BillRepository } from '../repository/bill.repository';
import { BillService } from '../service/bill.service';
import { DepartmentModule } from './department.module';
import { OrderModule } from './order.module';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([BillRepository]), DepartmentModule, forwardRef(() => OrderModule)],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
