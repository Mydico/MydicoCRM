import { EntityRepository, Repository } from 'typeorm';
import StoreHistory from '../domain/store-history.entity';

@EntityRepository(StoreHistory)
export class StoreHistoryRepository extends Repository<StoreHistory> {
  async createStoreHistoryQuery(queryString, date, options = null, productIds = null) {
    console.log('queryString',queryString)
    const tableAlias = 'StoreHistory'

    const query = this
      .createQueryBuilder(`${tableAlias}2`)
      .select(`${tableAlias}2.productId`)
      .addSelect(`MIN(${tableAlias}2.product_name)`, "product_name")
      .addSelect("Sum(remain)", "remain")
      .innerJoin(qb => {
        if (productIds) {
          qb.andWhere("StoreHistory.productId IN(:...ids)", { ids: productIds })

        }
        return qb.select(`${tableAlias}.productId,${tableAlias}.departmentId`)
          .addSelect("MAX(StoreHistory.id)", "id")
          .from(tableAlias, tableAlias)
          .leftJoin(`${tableAlias}.product`, 'product')
          .leftJoin('product.productBrand', 'brand')
          .leftJoin('product.productGroup', 'productGroup')
          .groupBy(`${tableAlias}.productId,${tableAlias}.departmentId`)
          .where(`DATE(${tableAlias}.createdDate) < '${date}'`)
          .andWhere(queryString)
      }
        ,
        tableAlias,
        `${tableAlias}.id = ${tableAlias}2.id`
      )
      .groupBy(`${tableAlias}2.productId`);


    if (options) {
      query.offset(options.skip);
      query.limit(options.take);
    }


    return query.getRawMany();
  }

}
