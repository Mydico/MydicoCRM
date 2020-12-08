import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAdvisoryController } from '../web/rest/customer-advisory.controller';
import { CustomerAdvisoryRepository } from '../repository/customer-advisory.repository';
import { CustomerAdvisoryService } from '../service/customer-advisory.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAdvisoryRepository])],
  controllers: [CustomerAdvisoryController],
  providers: [CustomerAdvisoryService],
  exports: [CustomerAdvisoryService]
})
export class CustomerAdvisoryModule {}
