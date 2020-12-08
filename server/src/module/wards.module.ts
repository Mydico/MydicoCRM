import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsController } from '../web/rest/wards.controller';
import { WardsRepository } from '../repository/wards.repository';
import { WardsService } from '../service/wards.service';

@Module({
  imports: [TypeOrmModule.forFeature([WardsRepository])],
  controllers: [WardsController],
  providers: [WardsService],
  exports: [WardsService]
})
export class WardsModule {}
