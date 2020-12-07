import { EntityRepository, Repository } from 'typeorm';
import TblProductDetails from '../domain/tbl-product-details.entity';

@EntityRepository(TblProductDetails)
export class TblProductDetailsRepository extends Repository<TblProductDetails> {}
