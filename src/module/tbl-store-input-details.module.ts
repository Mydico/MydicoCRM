import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblStoreInputDetailsController } from '../web/rest/tbl-store-input-details.controller';
import { TblStoreInputDetailsRepository } from '../repository/tbl-store-input-details.repository';
import { TblStoreInputDetailsService } from '../service/tbl-store-input-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblStoreInputDetailsRepository])],
  controllers: [TblStoreInputDetailsController],
  providers: [TblStoreInputDetailsService],
  exports: [TblStoreInputDetailsService]
})
export class TblStoreInputDetailsModule {}
