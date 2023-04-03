import { EntityRepository, Repository } from 'typeorm';
import Syllabus from '../domain/syllabus.entity';

@EntityRepository(Syllabus)
export class SyllabusRepository extends Repository<Syllabus> {}
