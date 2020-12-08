import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeController } from '../web/rest/user-type.controller';
import { UserTypeRepository } from '../repository/user-type.repository';
import { UserTypeService } from '../service/user-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeRepository])],
  controllers: [UserTypeController],
  providers: [UserTypeService],
  exports: [UserTypeService]
})
export class UserTypeModule {}
