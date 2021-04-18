import Transaction from '../../domain/transaction.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { HistoryConstants } from '../utils/history.constants';
import CustomerDebit from '../../domain/customer-debit.entity';

@EventSubscriber()
export class TransactionSubscriber implements EntitySubscriberInterface<Transaction> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Transaction;
    }

    async afterInsert(event: InsertEvent<Transaction>): Promise<any> {
        const customerDebitRepo = event.manager.getRepository(CustomerDebit);
        let exist = await customerDebitRepo.findOne({ where: { customer: event.entity.customer } });
        if(exist){
            exist.debt = event.entity.earlyDebt;
            exist.customer = event.entity.customer;
        }else{
            exist = new CustomerDebit();
            exist.debt = event.entity.earlyDebt;
            exist.customer = event.entity.customer;
        }
        await customerDebitRepo.save(exist);
    }
}
