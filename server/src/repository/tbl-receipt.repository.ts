import { EntityRepository, Repository } from 'typeorm';
import TblReceipt from '../domain/tbl-receipt.entity';

@EntityRepository(TblReceipt)
export class TblReceiptRepository extends Repository<TblReceipt> {}
