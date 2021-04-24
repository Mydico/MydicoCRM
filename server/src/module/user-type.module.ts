import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeController } from '../web/rest/user-type.controller';
import { UserTypeRepository } from '../repository/user-type.repository';
import { UserTypeService } from '../service/user-type.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserTypeRepository])],
    controllers: [UserTypeController],
    providers: [UserTypeService],
    exports: [UserTypeService],
})
export class UserTypeModule {}
