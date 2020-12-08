import { EntityRepository, Repository } from 'typeorm';
import Codlog from '../domain/codlog.entity';

@EntityRepository(Codlog)
export class CodlogRepository extends Repository<Codlog> {}
