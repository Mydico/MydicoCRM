import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswerController } from '../web/rest/user-answer.controller';
import { UserAnswerRepository } from '../repository/user-answer.repository';
import { UserAnswerService } from '../service/user-answer.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserAnswerRepository])],
    controllers: [UserAnswerController],
    providers: [UserAnswerService],
    exports: [UserAnswerService],
})
export class UserAnswerModule {}
