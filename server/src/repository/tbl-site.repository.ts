import { EntityRepository, Repository } from 'typeorm';
import TblSite from '../domain/tbl-site.entity';

@EntityRepository(TblSite)
export class TblSiteRepository extends Repository<TblSite> {}
