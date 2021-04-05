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
    private readonly storeInputDetailsService: StoreInputDetailsService
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
    options.where = { type: Not(StoreImportType.EXPORT) };
    return await this.storeInputRepository.findAndCount(options);
  }

  async findAndCountExport(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
    options.relations = relationshipNames;
    options.where = { type: StoreImportType.EXPORT };
    return await this.storeInputRepository.findAndCount(options);
  }

  async save(storeInput: StoreInput): Promise<StoreInput | undefined> {
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const entity = await this.findById(storeInput.id);
      const arrProduct = entity.storeInputDetails.map(item => item.product.id);
      const founded = await this.productQuantityService.findByfields({
        where: {
          product: In(arrProduct),
          store: entity.store
        }
      });
      if (entity.type !== StoreImportType.EXPORT && entity.type !== StoreImportType.EXPORT_TO_PROVIDER ) {
        const productNotInStore = entity.storeInputDetails
          .filter(item => !founded.some(exist => item.product.id === exist.product.id))
          .map(item => {
            return {
              product: item.product,
              store: entity.store,
              quantity: item.quantity,
              type: StoreHistoryType.IMPORT
            };
          });
        const productInStore = founded.map(item => {
          const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
          return {
            ...item,
            quantity: item.quantity + itemFounded[0].quantity
          };
        });
        const total = [...productInStore, ...productNotInStore];
        await this.productQuantityService.saveMany(total);
      } else {
        const productInStore = founded.map(item => {
          const itemFounded = entity.storeInputDetails.filter(origin => origin.product.id === item.product.id);
          return {
            ...item,
            quantity: item.quantity - itemFounded[0].quantity > 0 ? item.quantity - itemFounded[0].quantity : 0
          };
        });
        await this.productQuantityService.saveMany(productInStore);
        if (entity.storeTransfer) {
          const importStore = new StoreInput();
          importStore.store = entity.storeTransfer;
          importStore.type = StoreImportType.IMPORT_FROM_STORE;
          importStore.storeTransfer = entity.store;
          importStore.storeInputDetails = entity.storeInputDetails;
          importStore.createdBy = 'system'
          await this.storeInputRepository.save(importStore);
        }
      }
    }
    if(Array.isArray(storeInput.storeInputDetails)){
      await this.storeInputDetailsService.saveMany(storeInput.storeInputDetails);
    }
    return await this.storeInputRepository.save(storeInput);
  }

  async update(storeInput: StoreInput): Promise<StoreInput | undefined> {
    return await this.save(storeInput);
  }

  async delete(storeInput: StoreInput): Promise<StoreInput | undefined> {
    return await this.storeInputRepository.remove(storeInput);
  }
}
