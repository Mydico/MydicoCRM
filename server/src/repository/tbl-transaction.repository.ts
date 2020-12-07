import { EntityRepository, Repository } from 'typeorm';
import TblTransaction from '../domain/tbl-transaction.entity';

@EntityRepository(TblTransaction)
export class TblTransactionRepository extends Repository<TblTransaction> {}
