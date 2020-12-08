import { EntityRepository, Repository } from 'typeorm';
import ProductGroup from '../domain/product-group.entity';

@EntityRepository(ProductGroup)
export class ProductGroupRepository extends Repository<ProductGroup> {}
