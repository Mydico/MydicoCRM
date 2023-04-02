import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import Syllabus from '../domain/syllabus.entity';

@EntityRepository(Syllabus)
export class SyllabusRepository extends TreeRepository<Syllabus> {}
