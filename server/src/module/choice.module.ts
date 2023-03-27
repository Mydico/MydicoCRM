import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from '../web/rest/question.controller';
import { QuestionRepository } from '../repository/question.repository';
import { QuestionService } from '../service/question.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([QuestionRepository])],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
