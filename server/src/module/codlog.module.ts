import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodlogController } from '../web/rest/codlog.controller';
import { CodlogRepository } from '../repository/codlog.repository';
import { CodlogService } from '../service/codlog.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([CodlogRepository])],
    controllers: [CodlogController],
    providers: [CodlogService],
    exports: [CodlogService],
})
export class CodlogModule {}
