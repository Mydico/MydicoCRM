import { EntityRepository, Repository } from 'typeorm';
import CustomerToken from '../domain/customer-token.entity';

@EntityRepository(CustomerToken)
export class CustomerTokenRepository extends Repository<CustomerToken> {}
