import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueController } from '../web/rest/attribute-value.controller';
import { AttributeValueRepository } from '../repository/attribute-value.repository';
import { AttributeValueService } from '../service/attribute-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValueRepository])],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
  exports: [AttributeValueService]
})
export class AttributeValueModule {}
