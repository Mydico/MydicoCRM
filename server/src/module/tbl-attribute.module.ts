import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblAttributeController } from '../web/rest/tbl-attribute.controller';
import { TblAttributeRepository } from '../repository/tbl-attribute.repository';
import { TblAttributeService } from '../service/tbl-attribute.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblAttributeRepository])],
  controllers: [TblAttributeController],
  providers: [TblAttributeService],
  exports: [TblAttributeService]
})
export class TblAttributeModule {}
