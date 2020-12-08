import { EntityRepository, Repository } from 'typeorm';
import SiteMapDomain from '../domain/site-map-domain.entity';

@EntityRepository(SiteMapDomain)
export class SiteMapDomainRepository extends Repository<SiteMapDomain> {}
