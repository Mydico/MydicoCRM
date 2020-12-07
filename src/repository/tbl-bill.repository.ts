import { EntityRepository, Repository } from 'typeorm';
import TblBill from '../domain/tbl-bill.entity';

@EntityRepository(TblBill)
export class TblBillRepository extends Repository<TblBill> {}
