import { EntityRepository, Repository } from 'typeorm';
import TblCustomerCategory from '../domain/tbl-customer-category.entity';

@EntityRepository(TblCustomerCategory)
export class TblCustomerCategoryRepository extends Repository<TblCustomerCategory> {}
