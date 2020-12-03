import { EntityRepository, Repository } from 'typeorm';
import TblTransport from '../domain/tbl-transport.entity';

@EntityRepository(TblTransport)
export class TblTransportRepository extends Repository<TblTransport> {}
