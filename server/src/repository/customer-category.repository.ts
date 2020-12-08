import { EntityRepository, Repository } from 'typeorm';
import CustomerCategory from '../domain/customer-category.entity';

@EntityRepository(CustomerCategory)
export class CustomerCategoryRepository extends Repository<CustomerCategory> {}
