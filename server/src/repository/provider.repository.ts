import { EntityRepository, Repository } from 'typeorm';
import Provider from '../domain/provider.entity';

@EntityRepository(Provider)
export class ProviderRepository extends Repository<Provider> {}
