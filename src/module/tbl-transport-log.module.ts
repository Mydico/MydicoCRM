import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblTransportLogController } from '../web/rest/tbl-transport-log.controller';
import { TblTransportLogRepository } from '../repository/tbl-transport-log.repository';
import { TblTransportLogService } from '../service/tbl-transport-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblTransportLogRepository])],
  controllers: [TblTransportLogController],
  providers: [TblTransportLogService],
  exports: [TblTransportLogService]
})
export class TblTransportLogModule {}
