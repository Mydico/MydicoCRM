import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswerController } from '../web/rest/user-answer.controller';
import { UserAnswerRepository } from '../repository/user-answer.repository';
import { UserAnswerService } from '../service/user-answer.service';
import { SyllabusRepository } from '../repository/syllabus.repository';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserAnswerRepository, SyllabusRepository])],
    controllers: [UserAnswerController],
    providers: [UserAnswerService],
    exports: [UserAnswerService],
})
export class UserAnswerModule {}
