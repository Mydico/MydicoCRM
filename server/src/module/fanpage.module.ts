import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FanpageController } from '../web/rest/fanpage.controller';
import { FanpageRepository } from '../repository/fanpage.repository';
import { FanpageService } from '../service/fanpage.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([FanpageRepository])],
    controllers: [FanpageController],
    providers: [FanpageService],
    exports: [FanpageService],
})
export class FanpageModule {}
