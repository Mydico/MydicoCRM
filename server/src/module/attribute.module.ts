import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeController } from '../web/rest/attribute.controller';
import { AttributeRepository } from '../repository/attribute.repository';
import { AttributeService } from '../service/attribute.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([AttributeRepository])],
    controllers: [AttributeController],
    providers: [AttributeService],
    exports: [AttributeService],
})
export class AttributeModule {}
