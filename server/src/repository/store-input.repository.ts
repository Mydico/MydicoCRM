import { EntityRepository, Repository } from 'typeorm';
import StoreInput from '../domain/store-input.entity';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';

@EntityRepository(StoreInput)
export class StoreInputRepository extends Repository<StoreInput> {
    async removeCache(key) {
        return await this.manager.connection.queryResultCache.remove(key);
    }
    async  fetchDetails(filter, productId, tableAlias, type) {
        let queryString = queryBuilderFunc(tableAlias, filter);
        queryString = queryString.replace(`${tableAlias}.productId`, 'product.id');
        queryString = queryString.replace(`${tableAlias}.brandId`, 'brand.id');
        queryString = queryString.replace(`${tableAlias}.productGroupId`, 'productGroup.id');
        queryString = queryString.replace(`${tableAlias}.product_name`, 'product.name');
      
        // This is an optional step, based on the specific conditions in your use case.
        if (type !== 'ontheway' && type !== 'exportedProduct') {
          queryString = queryString.replace(`${tableAlias}.createdDate`, `${tableAlias}.lastModifiedDate`);
        }
      
        // Define additional conditions based on the type of action in the warehouse
        const additionalConditions: any = {};
        switch (type) {
          case 'importProduct':
            additionalConditions.type = 'IMPORT';
            additionalConditions.status = 'APPROVED';
            additionalConditions.createdBy = 'system';
            break;
          case 'returnProduct':
            additionalConditions.type = 'RETURN';
            additionalConditions.status = 'APPROVED';
            break;
          case 'inputProductFromExport':
            additionalConditions.type = 'IMPORT_FROM_STORE';
            additionalConditions.status = 'APPROVED';
            additionalConditions.relatedId = null;
            break;
          case 'exportStore':
            additionalConditions.type = 'EXPORT';
            additionalConditions.storeTransferId = null;
            additionalConditions.status = 'APPROVED';
            break;
          case 'exportStoreToProvider':
            additionalConditions.type = 'EXPORT';
            additionalConditions.providerId = null;
            additionalConditions.status = 'APPROVED';
            break;
          case 'ontheway':
            additionalConditions.id = 'StoreInput.relatedId';
            additionalConditions.type = 'EXPORT';
            additionalConditions.status = 'APPROVED';
            additionalConditions.type2 = 'IMPORT_FROM_STORE';
            additionalConditions.status2 = 'WAITING';
            break;
          case 'exportedProduct':
            additionalConditions.status = ['WAITING', 'APPROVED', 'CANCEL', 'DELETED', 'CREATED'];
            break;
        }
      
        const result = await this
          .createQueryBuilder(tableAlias)
          .select(`${tableAlias}.productId`)
          .addSelect(`SUM(${tableAlias}.quantity)`, type)
          .leftJoin(`${tableAlias}.product`, 'product')
          .leftJoin('product.productBrand', 'brand')
          .leftJoin('product.productGroup', 'productGroup')
          .where(`product.id IN(:...ids)`, { ids: productId })
          .andWhere(queryString)
          .groupBy(`${tableAlias}.productId`)
          .orderBy(`${tableAlias}.productId`, 'ASC')
          .getRawMany();
      
        return result;
      }
      
}
