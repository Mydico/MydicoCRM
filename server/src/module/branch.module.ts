import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchController } from '../web/rest/branch.controller';
import { BranchRepository } from '../repository/branch.repository';
import { BranchService } from '../service/branch.service';
import { RoleModule } from './role.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([BranchRepository]), RoleModule],
    controllers: [BranchController],
    providers: [BranchService],
    exports: [BranchService],
})
export class BranchModule {}
