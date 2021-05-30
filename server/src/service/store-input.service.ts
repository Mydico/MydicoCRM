import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreImportStatus } from '../domain/enumeration/store-import-status';
import { FindManyOptions, FindOneOptions, In, Not } from 'typeorm';
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

const relationshipNames = [];
relationshipNames.push('approver');
relationshipNames.push('store');
relationshipNames.push('customer');
relationshipNames.push('customer.sale');
relationshipNames.push('customer.department');
relationshipNames.push('customer.type');
relationshipNames.push('storeTransfer');
relationshipNames.push('provider');
relationshipNames.push('store.department');

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
  ) {}

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

  async findAndCount(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
    options.relations = relationshipNames;
    if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
      relationshipNames.push('storeInputDetails');
      relationshipNames.push('storeInputDetails.product');
    }
    options.where = { type: In([StoreImportType.IMPORT_FROM_STORE, StoreImportType.NEW, StoreImportType.RETURN]) };
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
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const entity = await this.findById(storeInput.id);
      const arrProduct = entity.storeInputDetails.map(item => item.product.id);
      const founded = await this.productQuantityService.findByfields({
        where: {
          product: In(arrProduct),
          store: entity.store
        }
      });
      if (entity.type !== StoreImportType.EXPORT && entity.type !== StoreImportType.EXPORT_TO_PROVIDER) {
        await this.importStore(founded, entity);
        if (entity.type === StoreImportType.RETURN) {
          this.createDebit(entity);
          const incomeItem = new IncomeDashboard();
          incomeItem.amount = entity.realMoney;
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
      order: { createdDate: 'DESC' }
    });
    const transaction = new Transaction();
    transaction.customer = entity.customer;
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
      return {
        ...item,
        quantity: item.quantity - itemFounded[0].quantity > 0 ? item.quantity - itemFounded[0].quantity : 0
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
      importStore.type = StoreImportType.IMPORT_FROM_STORE;
      importStore.storeTransfer = entity.store;
      importStore.department = entity.department
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
        type: StoreHistoryType.IMPORT
      }));
    const productInStore = founded.map(item => {
      const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
      return {
        ...item,
        department: entity.store.department,
        quantity: item.quantity + itemFounded[0].quantity
      };
    });
    const total = [...productInStore, ...productNotInStore];
    await this.productQuantityService.saveMany(total);
  }

  async delete(storeInput: StoreInput): Promise<StoreInput | undefined> {
    return await this.storeInputRepository.remove(storeInput);
  }
}
