import { EntityRepository, Repository } from 'typeorm';
import ProductGroupMap from '../domain/product-group-map.entity';

@EntityRepository(ProductGroupMap)
export class ProductGroupMapRepository extends Repository<ProductGroupMap> {}
