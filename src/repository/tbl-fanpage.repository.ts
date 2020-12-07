import { EntityRepository, Repository } from 'typeorm';
import TblFanpage from '../domain/tbl-fanpage.entity';

@EntityRepository(TblFanpage)
export class TblFanpageRepository extends Repository<TblFanpage> {}
