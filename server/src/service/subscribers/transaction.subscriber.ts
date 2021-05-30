import Transaction from '../../domain/transaction.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { HistoryConstants } from '../utils/history.constants';
import CustomerDebit from '../../domain/customer-debit.entity';
import DebtDashboard from '../../domain/debt-dashboard.entity';
import { TransactionType } from '../../domain/enumeration/transaction-type';
import { DashboardType } from '../../domain/enumeration/dashboard-type';
import Customer from '../../domain/customer.entity';

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
    const customerRepo = event.manager.getRepository(Customer);
    const foundedCustomer = await customerRepo.findOne({ where: { id: event.entity.customer.id }, relations: ['sale','department'] });
    const debtRepo = event.manager.getRepository(DebtDashboard);
    const debtDashboard = new DebtDashboard();
    if (event.entity.type === TransactionType.DEBIT) {
      debtDashboard.amount = event.entity.totalMoney;
      debtDashboard.userId = foundedCustomer.sale?.id || null;
      debtDashboard.type = DashboardType.DEBT;
    }else if(event.entity.type === TransactionType.PAYMENT) {
      debtDashboard.amount = event.entity.collectMoney;
      debtDashboard.userId = foundedCustomer.sale?.id || null;
      debtDashboard.type = DashboardType.DEBT_RECEIPT;
    }else if(event.entity.type === TransactionType.RETURN) {
      debtDashboard.amount = event.entity.refundMoney;
      debtDashboard.userId = foundedCustomer.sale?.id || null;
      debtDashboard.type = DashboardType.DEBT_RETURN;
    }
    await debtRepo.save(debtDashboard);
    let exist = await customerDebitRepo.findOne({ where: { customer: event.entity.customer } });
    if (exist) {
      exist.debt = event.entity.earlyDebt;
      exist.customer = event.entity.customer;
      exist.department = foundedCustomer.department
    } else {
      exist = new CustomerDebit();
      exist.debt = event.entity.earlyDebt;
      exist.customer = event.entity.customer;
      exist.department = foundedCustomer.department
    }
    await customerDebitRepo.save(exist);
  }
}
