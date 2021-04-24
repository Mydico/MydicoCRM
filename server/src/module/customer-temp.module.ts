import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTempController } from '../web/rest/customer-temp.controller';
import { CustomerTempRepository } from '../repository/customer-temp.repository';
import { CustomerTempService } from '../service/customer-temp.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CustomerTempRepository])],
    controllers: [CustomerTempController],
    providers: [CustomerTempService],
    exports: [CustomerTempService],
})
export class CustomerTempModule {}
