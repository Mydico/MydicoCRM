import { EntityRepository, Repository } from 'typeorm';
import Transport from '../domain/transport.entity';

@EntityRepository(Transport)
export class TransportRepository extends Repository<Transport> {}
