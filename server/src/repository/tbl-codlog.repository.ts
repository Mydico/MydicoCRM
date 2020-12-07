import { EntityRepository, Repository } from 'typeorm';
import TblCodlog from '../domain/tbl-codlog.entity';

@EntityRepository(TblCodlog)
export class TblCodlogRepository extends Repository<TblCodlog> {}
