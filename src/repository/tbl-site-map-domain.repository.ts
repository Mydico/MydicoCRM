import { EntityRepository, Repository } from 'typeorm';
import TblSiteMapDomain from '../domain/tbl-site-map-domain.entity';

@EntityRepository(TblSiteMapDomain)
export class TblSiteMapDomainRepository extends Repository<TblSiteMapDomain> {}
