import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreInputController } from '../web/rest/store-input.controller';
import { StoreInputRepository } from '../repository/store-input.repository';
import { StoreInputService } from '../service/store-input.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreInputRepository])],
  controllers: [StoreInputController],
  providers: [StoreInputService],
  exports: [StoreInputService]
})
export class StoreInputModule {}
