import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblStoreController } from '../web/rest/tbl-store.controller';
import { TblStoreRepository } from '../repository/tbl-store.repository';
import { TblStoreService } from '../service/tbl-store.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblStoreRepository])],
  controllers: [TblStoreController],
  providers: [TblStoreService],
  exports: [TblStoreService]
})
export class TblStoreModule {}
