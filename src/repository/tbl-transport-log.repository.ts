import { EntityRepository, Repository } from 'typeorm';
import TblTransportLog from '../domain/tbl-transport-log.entity';

@EntityRepository(TblTransportLog)
export class TblTransportLogRepository extends Repository<TblTransportLog> {}
