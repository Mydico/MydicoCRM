import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchController } from '../web/rest/branch.controller';
import { BranchRepository } from '../repository/branch.repository';
import { BranchService } from '../service/branch.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([BranchRepository])],
    controllers: [BranchController],
    providers: [BranchService],
    exports: [BranchService],
})
export class BranchModule {}
