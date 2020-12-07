import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblFanpageController } from '../web/rest/tbl-fanpage.controller';
import { TblFanpageRepository } from '../repository/tbl-fanpage.repository';
import { TblFanpageService } from '../service/tbl-fanpage.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblFanpageRepository])],
  controllers: [TblFanpageController],
  providers: [TblFanpageService],
  exports: [TblFanpageService]
})
export class TblFanpageModule {}
