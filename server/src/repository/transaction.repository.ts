import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../domain/transaction.entity';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {}
