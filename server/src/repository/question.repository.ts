import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import Question from '../domain/question.entity';

@EntityRepository(Question)
export class QuestionRepository extends TreeRepository<Question> {}
