import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreImportStatus } from '../domain/enumeration/store-import-status';
import { Brackets, FindManyOptions, FindOneOptions, In, Not } from 'typeorm';
import StoreInput from '../domain/store-input.entity';
import { StoreInputRepository } from '../repository/store-input.repository';
import { ProductQuantityService } from './product-quantity.service';
import { StoreImportType } from '../domain/enumeration/store-import-type';
import { StoreHistoryService } from './store-history.service';
import { StoreHistoryType } from '../domain/enumeration/store-history-type';
import { StoreInputDetailsService } from './store-input-details.service';
import ProductQuantity from '../domain/product-quantity.entity';
import { TransactionService } from './transaction.service';
import Transaction from '../domain/transaction.entity';
import { TransactionType } from '../domain/enumeration/transaction-type';
import { OrderService } from './order.service';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { DashboardType } from '../domain/enumeration/dashboard-type';
import { IncomeDashboardService } from './income-dashboard.service';
import { User } from '../domain/user.entity';

const relationshipNames = [];
relationshipNames.push('approver');
relationshipNames.push('store');
relationshipNames.push('customer');
relationshipNames.push('customer.sale');
relationshipNames.push('customer.branch');
relationshipNames.push('customer.department');
relationshipNames.push('customer.type');
relationshipNames.push('storeTransfer');
relationshipNames.push('storeTransfer.department');
relationshipNames.push('provider');
relationshipNames.push('store.department');
relationshipNames.push('department');

@Injectable()
export class StoreInputService {
    logger = new Logger('StoreInputService');

    constructor(
        @InjectRepository(StoreInputRepository) private storeInputRepository: StoreInputRepository,
        private readonly productQuantityService: ProductQuantityService,
        private readonly storeInputDetailsService: StoreInputDetailsService,
        private readonly transactionService: TransactionService,
        private readonly orderService: OrderService,
        private readonly incomeDashboardService: IncomeDashboardService
    ) { }

    async findById(id: string): Promise<StoreInput | undefined> {
        if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
            relationshipNames.push('storeInputDetails');
            relationshipNames.push('storeInputDetails.product');
        }
        const options = { relations: relationshipNames };
        return await this.storeInputRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<StoreInput>): Promise<StoreInput | undefined> {
        return await this.storeInputRepository.findOne(options);
    }

    async canExportStore(storeInput: StoreInput): Promise<boolean> {
        const foundedStoreInput = await this.findById(storeInput.id);
        const merged = foundedStoreInput.storeInputDetails.reduce((previousValue, currentValue) => {
            const sum = previousValue.find(e => e.product.id === currentValue.product.id);
            if (!sum) {
                previousValue.push(Object.assign({}, currentValue));
            } else {
                sum.quantity += currentValue.quantity;
            }
            return previousValue;
        }, []);
        const arrIds = merged.map(item => item.product.id);
        const foundedProductInStore = await this.orderService.getProductInStore([...new Set(arrIds)], foundedStoreInput.store);
        if (foundedProductInStore.length == 0) {
            return false;
        }
        let canExport = true;
        merged.forEach(item => {
            const founded = foundedProductInStore.filter(store => store.product.id === item.product.id);
            if (founded.length > 0) {
                if (founded[0].quantity < item.quantity) {
                    canExport = false;
                    return;
                }
            }
        });
        return canExport;
    }

    // async findAndCount(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
    //   options.relations = relationshipNames;
    //   if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
    //     relationshipNames.push('storeInputDetails');
    //     relationshipNames.push('storeInputDetails.product');
    //   }
    //   options.where = { type: In([StoreImportType.IMPORT_FROM_STORE, StoreImportType.NEW]) };
    //   return await this.storeInputRepository.findAndCount(options);
    // }

    async findAndCount(
        options: FindManyOptions<StoreInput>,
        filter = {},
        departmentVisible = [],
        isEmployee: boolean,
        currentUser: User,
        type = ''
    ): Promise<[StoreInput[], number]> {
        let queryString = '';
        Object.keys(filter).forEach((item, index) => {
            if (item === 'endDate' || item === 'startDate') return;
            queryString += `StoreInput.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
        });
        let andQueryString = '';

        if (departmentVisible.length > 0) {
            andQueryString += ` ${andQueryString.length === 0? "":" AND "} StoreInput.department IN ${JSON.stringify(departmentVisible)
                .replace('[', '(')
                .replace(']', ')')}`;
        }
        if (filter['endDate'] && filter['startDate']) {
            andQueryString += ` ${andQueryString.length === 0? "":" AND "} StoreInput.createdDate  >= '${filter['startDate']}' AND StoreInput.createdDate <= '${filter['endDate']} 24:00:00'`;
        }
        if (type.length > 0) {
            andQueryString += ` ${andQueryString.length === 0? "":" AND "} StoreInput.type like '%${type}%' `;
        }
        if(isEmployee && type.includes("RETURN")){
            andQueryString += ` ${andQueryString.length === 0? "":" AND "} StoreInput.sale = ${currentUser.id} `;
        }
        const cacheKeyBuilder = `get_StoreInputs_department_${departmentVisible.join(',')}_endDate_${filter['endDate'] || ''}startDate${filter['startDate'] || ''}_type_${type}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}_StoreInput.${Object.keys(options.order)[0] ||
            'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;
        const queryBuilder = this.storeInputRepository
            .createQueryBuilder('StoreInput')
            .leftJoinAndSelect('StoreInput.approver', 'approver')
            .leftJoinAndSelect('StoreInput.store', 'store')
            .leftJoinAndSelect('StoreInput.department', 'department')
            .leftJoinAndSelect('StoreInput.customer', 'customer')
            .leftJoinAndSelect('StoreInput.sale', 'sale')
            .leftJoinAndSelect('StoreInput.storeInputDetails', 'storeInputDetails')
            .leftJoinAndSelect('storeInputDetails.product', 'product')
            .leftJoinAndSelect('StoreInput.storeTransfer', 'storeTransfer')
            .cache(cacheKeyBuilder, 604800)
            .where(andQueryString)
            .orderBy(`StoreInput.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take);

        const count = this.storeInputRepository
            .createQueryBuilder('StoreInput')
            .where(andQueryString)
            .orderBy(`StoreInput.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take)
            .cache(
                `cache_count_get_StoreInputs_department_${JSON.stringify(departmentVisible)}_type_${type}_filter_${JSON.stringify(filter)}`
            );
        if (queryString) {
            queryBuilder.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            );
            count.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            );
        }

        const result = await queryBuilder.getManyAndCount();
        result[1] = await count.getCount();
        return result;
    }

    async findAndCountReturn(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
        options.relations = relationshipNames;
        if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
            relationshipNames.push('storeInputDetails');
            relationshipNames.push('storeInputDetails.product');
        }
        options.where = { type: In([StoreImportType.RETURN]) };
        return await this.storeInputRepository.findAndCount(options);
    }

    async findAndCountExport(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
        if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
            relationshipNames.push('storeInputDetails');
            relationshipNames.push('storeInputDetails.product');
        }
        options.relations = relationshipNames;
        return await this.storeInputRepository.findAndCount(options);
    }

    async save(storeInput: StoreInput): Promise<StoreInput | undefined> {
        if (Array.isArray(storeInput.storeInputDetails)) {
            await this.storeInputDetailsService.saveMany(storeInput.storeInputDetails);
        }
        return await this.storeInputRepository.save(storeInput);
    }

    async update(storeInput: StoreInput): Promise<StoreInput | undefined> {
        const entity = await this.findById(storeInput.id);

        if (entity.status === StoreImportStatus.APPROVED && storeInput.status === StoreImportStatus.APPROVED) {
            throw new HttpException('Phiếu này đã được duyệt', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (storeInput.status === StoreImportStatus.APPROVED) {
            const arrProduct = entity.storeInputDetails.map(item => item.product.id);
            const founded = await this.productQuantityService.findByfields({
                where: {
                    product: In(arrProduct),
                    store: entity.store,
                },
            });
            if (entity.type !== StoreImportType.EXPORT && entity.type !== StoreImportType.EXPORT_TO_PROVIDER) {
                await this.importStore(founded, entity);
                if (entity.type === StoreImportType.RETURN) {
                    await this.createDebit(entity);
                    const incomeItem = new IncomeDashboard();
                    incomeItem.amount = entity.realMoney;
                    incomeItem.departmentId = entity.department.id;
                    incomeItem.type = DashboardType.RETURN;
                    incomeItem.userId = entity.customer.sale.id;
                    await this.incomeDashboardService.save(incomeItem);
                }
            } else {
                await this.exportStore(founded, entity);
            }
        }
        return await this.save(storeInput);
    }

    async createDebit(entity: StoreInput): Promise<void> {
        const latestTransaction = await this.transactionService.findByfields({
            where: { customer: entity.customer },
            order: { createdDate: 'DESC' },
        });
        const transaction = new Transaction();
        transaction.customer = entity.customer;
        transaction.customerCode = entity.customer.code;
        transaction.customerName = entity.customer.name;
        transaction.sale = entity.customer.sale || null;
        transaction.saleName = entity.customer.sale?.code || null;
        transaction.branch= entity.customer.branch;
        transaction.department = entity.department;
        transaction.storeInput = entity;
        transaction.refundMoney = entity.realMoney;
        transaction.type = TransactionType.RETURN;
        transaction.previousDebt = latestTransaction ? latestTransaction.earlyDebt : 0;
        transaction.earlyDebt = latestTransaction
            ? Number(latestTransaction.earlyDebt) - Number(entity.realMoney)
            : 0 - Number(entity.realMoney);
        await this.transactionService.save(transaction);
    }

    async exportStore(founded: ProductQuantity[], entity: StoreInput): Promise<void> {
        const productInStore = founded.map(item => {
            const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
            const totalProduct = itemFounded.reduce((prev, current) => prev + current.quantity, 0);

            return {
                ...item,
                quantity: item.quantity - totalProduct > 0 ? item.quantity - totalProduct : 0,
            };
        });
        await this.productQuantityService.saveMany(productInStore);
        if (entity.storeTransfer) {
            let arrDetails = [];
            if (Array.isArray(entity.storeInputDetails)) {
                arrDetails = entity.storeInputDetails.map(item => ({ ...item, id: null }));
            }
            const importStore = new StoreInput();
            importStore.store = entity.storeTransfer;
            importStore.storeName = entity.storeTransfer.name;
            importStore.type = StoreImportType.IMPORT_FROM_STORE;
            importStore.storeTransfer = entity.store;
            importStore.storeTransferName = entity.store.name;
            importStore.department = entity.storeTransfer.department;
            importStore.storeInputDetails = arrDetails;
            importStore.createdBy = 'system';
            await this.save(importStore);
        }
    }

    async importStore(founded: ProductQuantity[], entity: StoreInput): Promise<void> {
        const productNotInStore = entity.storeInputDetails
            .filter(item => !founded.some(exist => item.product.id === exist.product.id))
            .map(item => ({
                product: item.product,
                store: entity.store,
                department: entity.store.department,
                quantity: item.quantity,
                name: item.product.name,
                storeName: entity.store.name,
                type: StoreHistoryType.IMPORT,
            }));
        const productInStore = founded.map(item => {
            const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
            const totalProduct = itemFounded.reduce((prev, current) => prev + current.quantity, 0);
            return {
                ...item,
                department: entity.store.department,
                quantity: item.quantity + totalProduct,
            };
        });
        const total = [...productInStore, ...productNotInStore];
        await this.productQuantityService.saveMany(total);
    }

    async delete(storeInput: StoreInput): Promise<StoreInput | undefined> {
        return await this.storeInputRepository.remove(storeInput);
    }
}
