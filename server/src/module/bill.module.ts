import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from '../web/rest/bill.controller';
import { BillRepository } from '../repository/bill.repository';
import { BillService } from '../service/bill.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([BillRepository])],
    controllers: [BillController],
    providers: [BillService],
    exports: [BillService],
})
export class BillModule {}
