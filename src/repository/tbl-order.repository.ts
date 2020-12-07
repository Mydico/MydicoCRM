import { EntityRepository, Repository } from 'typeorm';
import TblOrder from '../domain/tbl-order.entity';

@EntityRepository(TblOrder)
export class TblOrderRepository extends Repository<TblOrder> {}
