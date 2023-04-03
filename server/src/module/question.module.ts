import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from '../web/rest/question.controller';
import { QuestionRepository } from '../repository/question.repository';
import { QuestionService } from '../service/question.service';
import { SyllabusRepository } from '../repository/syllabus.repository';
import { UserAnswerRepository } from '../repository/user-answer.repository';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([QuestionRepository, SyllabusRepository, UserAnswerRepository])],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
