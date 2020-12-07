import { EntityRepository, Repository } from 'typeorm';
import TblOrderDetails from '../domain/tbl-order-details.entity';

@EntityRepository(TblOrderDetails)
export class TblOrderDetailsRepository extends Repository<TblOrderDetails> {}
