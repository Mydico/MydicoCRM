import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictController } from '../web/rest/district.controller';
import { DistrictRepository } from '../repository/district.repository';
import { DistrictService } from '../service/district.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([DistrictRepository])],
    controllers: [DistrictController],
    providers: [DistrictService],
    exports: [DistrictService],
})
export class DistrictModule {}
