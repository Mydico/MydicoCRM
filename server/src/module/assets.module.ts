import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from '../web/rest/asset.controller';
import { AssetRepository } from '../repository/asset.repository';
import { AssetService } from '../service/asset.service';
import { RoleModule } from './role.module';

@Module({
    imports: [TypeOrmModule.forFeature([AssetRepository]), RoleModule],
    controllers: [AssetController],
    providers: [AssetService],
    exports: [AssetService],
})
export class AssetModule {}
