import { EntityRepository, Repository } from 'typeorm';
import TblProductQuantity from '../domain/tbl-product-quantity.entity';

@EntityRepository(TblProductQuantity)
export class TblProductQuantityRepository extends Repository<TblProductQuantity> {}
