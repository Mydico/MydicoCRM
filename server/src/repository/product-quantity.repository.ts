import { EntityRepository, Repository } from 'typeorm';
import ProductQuantity from '../domain/product-quantity.entity';

@EntityRepository(ProductQuantity)
export class ProductQuantityRepository extends Repository<ProductQuantity> {}
