import { EntityRepository, Repository } from 'typeorm';
import Site from '../domain/site.entity';

@EntityRepository(Site)
export class SiteRepository extends Repository<Site> {}
