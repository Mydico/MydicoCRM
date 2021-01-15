import { EntityRepository, Repository } from 'typeorm';
import ProductBrand from '../domain/product-brand.entity';

@EntityRepository(ProductBrand)
export class ProductBrandRepository extends Repository<ProductBrand> {}
