import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblStoreInputController } from '../web/rest/tbl-store-input.controller';
import { TblStoreInputRepository } from '../repository/tbl-store-input.repository';
import { TblStoreInputService } from '../service/tbl-store-input.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblStoreInputRepository])],
  controllers: [TblStoreInputController],
  providers: [TblStoreInputService],
  exports: [TblStoreInputService]
})
export class TblStoreInputModule {}
