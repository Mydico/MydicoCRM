import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerMapController } from '../web/rest/customer-map.controller';
import { CustomerMapRepository } from '../repository/customer-map.repository';
import { CustomerMapService } from '../service/customer-map.service';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerMapRepository])],
    controllers: [CustomerMapController],
    providers: [CustomerMapService],
    exports: [CustomerMapService],
})
export class CustomerMapModule {}
