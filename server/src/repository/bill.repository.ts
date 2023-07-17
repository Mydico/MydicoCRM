import { EntityRepository, Repository } from 'typeorm';
import Bill from '../domain/bill.entity';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';

@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {
  async removeCache(key) {
    return await this.manager.connection.queryResultCache.remove(key);
  }

  async fetchExportedProduct(filter, productId, tableAlias) {
    // Build the query string.
    let queryString = queryBuilderFunc(tableAlias, filter);
    queryString = queryString.replace(`${tableAlias}.productId`, 'product.id');
    queryString = queryString.replace(`${tableAlias}.brandId`, 'brand.id');
    queryString = queryString.replace(`${tableAlias}.productGroupId`, 'productGroup.id');
    queryString = queryString.replace(`${tableAlias}.product_name`, 'product.name');

    // Add a condition for exported products.
    const additionalConditions = {
      status: ['WAITING', 'APPROVED', 'CANCEL', 'DELETED', 'CREATED']
    };

    // Perform the query.
    const result = await this
      .createQueryBuilder(tableAlias)
      .select(`${tableAlias}.productId`)
      .addSelect(`SUM(${tableAlias}.quantity)`, 'exportedProduct')
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
