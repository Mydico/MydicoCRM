import { EntityRepository, Repository } from 'typeorm';
import ProductDetails from '../domain/product-details.entity';

@EntityRepository(ProductDetails)
export class ProductDetailsRepository extends Repository<ProductDetails> {}
