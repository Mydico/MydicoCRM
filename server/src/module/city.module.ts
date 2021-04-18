import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityController } from '../web/rest/city.controller';
import { CityRepository } from '../repository/city.repository';
import { CityService } from '../service/city.service';

@Module({
    imports: [TypeOrmModule.forFeature([CityRepository])],
    controllers: [CityController],
    providers: [CityService],
    exports: [CityService],
})
export class CityModule {}
