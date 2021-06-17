import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptStatus } from '../domain/enumeration/receipt-status';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import Receipt from '../domain/receipt.entity';
import { ReceiptRepository } from '../repository/receipt.repository';
import { TransactionService } from './transaction.service';
import Transaction from '../domain/transaction.entity';
import { TransactionType } from '../domain/enumeration/transaction-type';
import { IncomeDashboardService } from './income-dashboard.service';
import { DashboardType } from '../domain/enumeration/dashboard-type';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { User } from '../domain/user.entity';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('customer.sale');
relationshipNames.push('approver');
@Injectable()
export class ReceiptService {
    logger = new Logger('ReceiptService');

    constructor(
        @InjectRepository(ReceiptRepository) private receiptRepository: ReceiptRepository,
        private readonly transactionService: TransactionService,
        private readonly incomeDashboardService: IncomeDashboardService
    ) { }

    async findById(id: string): Promise<Receipt | undefined> {
        const options = { relations: relationshipNames };
        return await this.receiptRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Receipt>): Promise<Receipt | undefined> {
        return await this.receiptRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Receipt>, filter = [],
        departmentVisible = [],
        isEmployee: boolean,
        currentUser: User): Promise<[Receipt[], number]> {
        let queryString = '';
        Object.keys(filter).forEach((item, index) => {
            queryString += `Receipt.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
        });
        let andQueryString = '';

        if (departmentVisible.length > 0) {
            andQueryString += `Receipt.department IN ${JSON.stringify(departmentVisible)
                .replace('[', '(')
                .replace(']', ')')}`;
        }
        if (isEmployee) andQueryString += ` AND Receipt.sale = ${currentUser.id}`;
        if (currentUser.branch) {
            if (!currentUser.branch.seeAll) {
              andQueryString += ` AND Receipt.branch = ${currentUser.branch.id}`;
            }
          }else{
            andQueryString += ` AND Receipt.branch is NULL `;
          }

        const queryBuilder = this.receiptRepository
            .createQueryBuilder('Receipt')
            .leftJoinAndSelect('Receipt.customer', 'customer')
            .leftJoinAndSelect('Receipt.sale', 'sale')
            .leftJoinAndSelect('Receipt.approver', 'approver')
            .where(andQueryString)

            .orderBy(`Receipt.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take)
        if (queryString) {
            queryBuilder.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            )
        }
        return await queryBuilder.getManyAndCount();

        // options.relations = relationshipNames;
        // return await this.receiptRepository.findAndCount(options);
    }

    async save(receipt: Receipt): Promise<Receipt | undefined> {
        const count = await this.receiptRepository
            .createQueryBuilder('receipt')
            .select('DISTINCT()')
            .getCount();
        if (!receipt.id) {
            receipt.code = `PT${count + 1}`;
        }
        return await this.receiptRepository.save(receipt);
    }

    async update(receipt: Receipt): Promise<Receipt | undefined> {
        if (receipt.status === ReceiptStatus.APPROVED) {
            const entity = await this.findById(receipt.id);
            const latestTransaction = await this.transactionService.findByfields({
                where: { customer: entity.customer },
                order: { createdDate: 'DESC' },
            });
            const transaction = new Transaction();
            transaction.customer = entity.customer;
            transaction.receipt = entity;
            transaction.collectMoney = entity.money;
            transaction.type = TransactionType.PAYMENT;
            transaction.previousDebt = latestTransaction ? latestTransaction.earlyDebt : 0;
            transaction.earlyDebt = latestTransaction ? Number(latestTransaction.earlyDebt) - Number(entity.money) : 0 - Number(entity.money);
            await this.transactionService.save(transaction);
            const incomeItem = new IncomeDashboard();
            incomeItem.amount = entity.money;
            incomeItem.type = DashboardType.DEBT;
            incomeItem.userId = entity.customer.sale.id;
            await this.incomeDashboardService.save(incomeItem);
        }
        return await this.save(receipt);
    }

    async delete(receipt: Receipt): Promise<Receipt | undefined> {
        return await this.receiptRepository.remove(receipt);
    }
}
