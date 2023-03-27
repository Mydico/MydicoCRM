import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChoiceController } from '../web/rest/choice.controller';
import { ChoiceRepository } from '../repository/choice.repository';
import { ChoiceService } from '../service/choice.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([ChoiceRepository])],
    controllers: [ChoiceController],
    providers: [ChoiceService],
    exports: [ChoiceService],
})
export class ChoiceModule {}
