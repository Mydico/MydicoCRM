import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSkinController } from '../web/rest/customer-skin.controller';
import { CustomerSkinRepository } from '../repository/customer-skin.repository';
import { CustomerSkinService } from '../service/customer-skin.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerSkinRepository])],
  controllers: [CustomerSkinController],
  providers: [CustomerSkinService],
  exports: [CustomerSkinService]
})
export class CustomerSkinModule {}
