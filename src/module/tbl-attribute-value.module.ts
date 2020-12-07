import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblAttributeValueController } from '../web/rest/tbl-attribute-value.controller';
import { TblAttributeValueRepository } from '../repository/tbl-attribute-value.repository';
import { TblAttributeValueService } from '../service/tbl-attribute-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblAttributeValueRepository])],
  controllers: [TblAttributeValueController],
  providers: [TblAttributeValueService],
  exports: [TblAttributeValueService]
})
export class TblAttributeValueModule {}
