import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeController } from '../web/rest/customer-type.controller';
import { CustomerTypeRepository } from '../repository/customer-type.repository';
import { CustomerTypeService } from '../service/customer-type.service';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerTypeRepository])],
    controllers: [CustomerTypeController],
    providers: [CustomerTypeService],
    exports: [CustomerTypeService],
})
export class CustomerTypeModule {}
