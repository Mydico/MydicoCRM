import Transaction from '../../domain/transaction.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
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
        // const customerRepo = event.manager.getRepository(Customer);
        // const foundedCustomer = await customerRepo.findOne({ where: { id: event.entity.customer.id }, relations: ['sale','department','branch'] });
        // const debtRepo = event.manager.getRepository(DebtDashboard);
        // const debtDashboard = new DebtDashboard();
        // if (event.entity.type === TransactionType.DEBIT) {
        //     debtDashboard.amount = event.entity.totalMoney;
        //     debtDashboard.departmentId = event.entity.order?.department?.id || event.entity.department.id;
        //     debtDashboard.branchId = event.entity.order?.branch?.id || event.entity.branch.id;
        //     debtDashboard.saleId = event.entity.order?.sale.id || event.entity.sale.id;
        //     debtDashboard.type = DashboardType.DEBT;
        // }else if(event.entity.type === TransactionType.PAYMENT) {
        //     debtDashboard.amount = event.entity.collectMoney;
        //     debtDashboard.saleId = foundedCustomer.sale?.id || null;
        //     debtDashboard.departmentId = foundedCustomer.department.id;
        //     debtDashboard.branchId = foundedCustomer.branch.id;
        //     debtDashboard.type = DashboardType.DEBT_RECEIPT;
        // }else if(event.entity.type === TransactionType.RETURN) {
        //     debtDashboard.amount = event.entity.refundMoney;
        //     debtDashboard.saleId = foundedCustomer.sale?.id || null;
        //     debtDashboard.departmentId = foundedCustomer.department.id;
        //     debtDashboard.branchId = foundedCustomer.branch.id;
        //     debtDashboard.type = DashboardType.DEBT_RETURN;
        // }
        // await debtRepo.save(debtDashboard);
        // let exist = await customerDebitRepo.findOne({ where: { customer: event.entity.customer } });
        // if (exist) {
        //     exist.debt = event.entity.earlyDebt;
        //     exist.lastModifiedDate = new Date();
        //     exist.branch = foundedCustomer.branch;
        // } else {
        //     exist = new CustomerDebit();
        //     exist.debt = event.entity.earlyDebt;
        //     exist.customer = event.entity.customer;
        //     exist.department = foundedCustomer.department;
        //     exist.lastModifiedDate = new Date();
        //     exist.branch = foundedCustomer.branch;
        //     exist.customerName = foundedCustomer.name;
        //     exist.customerCode = foundedCustomer.code;
        //     exist.saleName = foundedCustomer.sale.code;
        //     exist.sale = event.entity.type === TransactionType.DEBIT? event.entity.order.sale : foundedCustomer.sale;
        // }
        // await customerDebitRepo.save(exist);
    }
}
