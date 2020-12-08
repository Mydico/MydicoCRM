import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportLogController } from '../web/rest/transport-log.controller';
import { TransportLogRepository } from '../repository/transport-log.repository';
import { TransportLogService } from '../service/transport-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransportLogRepository])],
  controllers: [TransportLogController],
  providers: [TransportLogService],
  exports: [TransportLogService]
})
export class TransportLogModule {}
