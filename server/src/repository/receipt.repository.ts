import { EntityRepository, Repository } from 'typeorm';
import Receipt from '../domain/receipt.entity';

@EntityRepository(Receipt)
export class ReceiptRepository extends Repository<Receipt> {}
