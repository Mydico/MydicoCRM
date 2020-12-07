import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblTransportController } from '../web/rest/tbl-transport.controller';
import { TblTransportRepository } from '../repository/tbl-transport.repository';
import { TblTransportService } from '../service/tbl-transport.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblTransportRepository])],
  controllers: [TblTransportController],
  providers: [TblTransportService],
  exports: [TblTransportService]
})
export class TblTransportModule {}
