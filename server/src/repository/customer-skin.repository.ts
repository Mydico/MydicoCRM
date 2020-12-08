import { EntityRepository, Repository } from 'typeorm';
import CustomerSkin from '../domain/customer-skin.entity';

@EntityRepository(CustomerSkin)
export class CustomerSkinRepository extends Repository<CustomerSkin> {}
