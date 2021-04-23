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

const relationshipNames = [];
relationshipNames.push('approver');
relationshipNames.push('store');
relationshipNames.push('customer');
relationshipNames.push('storeTransfer');
relationshipNames.push('provider');

@Injectable()
export class StoreInputService {
    logger = new Logger('StoreInputService');

    constructor(
        @InjectRepository(StoreInputRepository) private storeInputRepository: StoreInputRepository,
        private readonly productQuantityService: ProductQuantityService,
        private readonly storeInputDetailsService: StoreInputDetailsService,
        private readonly transactionService: TransactionService
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

    async findAndCount(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
        options.relations = relationshipNames;
        if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
            relationshipNames.push('storeInputDetails');
            relationshipNames.push('storeInputDetails.product');
        }
        options.where = { type: Not(StoreImportType.EXPORT) };
        return await this.storeInputRepository.findAndCount(options);
    }

    async findAndCountExport(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
        if (!relationshipNames.includes('storeInputDetails') && !relationshipNames.includes('storeInputDetails.product')) {
            relationshipNames.push('storeInputDetails');
            relationshipNames.push('storeInputDetails.product');
        }
        options.relations = relationshipNames;
        options.where = { type: StoreImportType.EXPORT };
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
                    store: entity.store,
                },
            });
            if (entity.type !== StoreImportType.EXPORT && entity.type !== StoreImportType.EXPORT_TO_PROVIDER) {
                await this.importStore(founded, entity);
                if (entity.type === StoreImportType.RETURN) {
                    this.createDebit(entity);
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
        transaction.storeInput = entity;
        transaction.refundMoney = entity.totalMoney;
        transaction.type = TransactionType.RETURN;
        transaction.previousDebt = latestTransaction ? latestTransaction.earlyDebt : 0;
        transaction.earlyDebt = latestTransaction ? Number(latestTransaction.earlyDebt) -  Number(entity.totalMoney) : 0 -  Number(entity.totalMoney);
        await this.transactionService.save(transaction);
    }

    async exportStore(founded: ProductQuantity[], entity: StoreInput): Promise<void> {
        const productInStore = founded.map(item => {
            const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
            return {
                ...item,
                quantity: item.quantity - itemFounded[0].quantity > 0 ? item.quantity - itemFounded[0].quantity : 0,
            };
        });
        await this.productQuantityService.saveMany(productInStore);
        if (entity.storeTransfer) {
            const importStore = new StoreInput();
            importStore.store = entity.storeTransfer;
            importStore.type = StoreImportType.IMPORT_FROM_STORE;
            importStore.storeTransfer = entity.store;
            importStore.storeInputDetails = entity.storeInputDetails;
            importStore.createdBy = 'system';
            await this.storeInputRepository.save(importStore);
        }
    }

    async importStore(founded: ProductQuantity[], entity: StoreInput): Promise<void> {
        const productNotInStore = entity.storeInputDetails
            .filter(item => !founded.some(exist => item.product.id === exist.product.id))
            .map(item => ({
                product: item.product,
                store: entity.store,
                quantity: item.quantity,
                type: StoreHistoryType.IMPORT,
            }));
        const productInStore = founded.map(item => {
            const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
            return {
                ...item,
                quantity: item.quantity + itemFounded[0].quantity,
            };
        });
        const total = [...productInStore, ...productNotInStore];
        await this.productQuantityService.saveMany(total);
    }

    async delete(storeInput: StoreInput): Promise<StoreInput | undefined> {
        return await this.storeInputRepository.remove(storeInput);
    }
}
