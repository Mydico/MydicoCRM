import { EntityRepository, Repository } from 'typeorm';
import TblProduct from '../domain/tbl-product.entity';

@EntityRepository(TblProduct)
export class TblProductRepository extends Repository<TblProduct> {}
