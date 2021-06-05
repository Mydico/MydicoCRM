import { CacheModule, Module } from '@nestjs/common';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserRepository } from '../repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { RoleModule } from './role.module';
import { BranchModule } from './branch.module';
import { DepartmentModule } from './department.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserRepository]), RoleModule, BranchModule, DepartmentModule],
    controllers: [UserController, ManagementController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
