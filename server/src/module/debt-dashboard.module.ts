import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeMapController } from '../web/rest/attribute-map.controller';
import { AttributeMapRepository } from '../repository/attribute-map.repository';
import { AttributeMapService } from '../service/attribute-map.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([AttributeMapRepository])],
    controllers: [AttributeMapController],
    providers: [AttributeMapService],
    exports: [AttributeMapService],
})
export class AttributeMapModule {}
