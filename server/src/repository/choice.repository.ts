import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import Choice from '../domain/choice.entity';

@EntityRepository(Choice)
export class ChoiceRepository extends TreeRepository<Choice> {}
