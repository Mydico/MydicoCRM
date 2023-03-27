import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import UserAnswer from '../domain/user-answer.entity';

@EntityRepository(UserAnswer)
export class UserAnswerRepository extends TreeRepository<UserAnswer> {}
