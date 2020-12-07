import { EntityRepository, Repository } from 'typeorm';
import TblWards from '../domain/tbl-wards.entity';

@EntityRepository(TblWards)
export class TblWardsRepository extends Repository<TblWards> {}
