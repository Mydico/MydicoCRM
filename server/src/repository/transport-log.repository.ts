import { EntityRepository, Repository } from 'typeorm';
import TransportLog from '../domain/transport-log.entity';

@EntityRepository(TransportLog)
export class TransportLogRepository extends Repository<TransportLog> {}
