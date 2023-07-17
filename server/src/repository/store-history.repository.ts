import { EntityRepository, Repository } from 'typeorm';
import StoreHistory from '../domain/store-history.entity';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';

@EntityRepository(StoreHistory)
export class StoreHistoryRepository extends Repository<StoreHistory> {
     async createStoreHistoryQuery( filter,  selectStatements = [], whereClause = null, orderBy = null, options = null) {
        const tableAlias = 'StoreHistory'
        const filterForStoreHistory = { ...filter };
        delete filterForStoreHistory.branch;
      
        let queryString = queryBuilderFunc(tableAlias, filterForStoreHistory, false, true);
        queryString = queryString.replace(`${tableAlias}.productId`, 'product.id');
        queryString = queryString.replace(`${tableAlias}.brandId`, 'brand.id');
        queryString = queryString.replace(`${tableAlias}.productGroupId`, 'productGroup.id');
        queryString = queryString.replace(`${tableAlias}.product_name`, 'product.name');
      
        const query = this
          .createQueryBuilder(tableAlias)
          .select(selectStatements)
          .innerJoin(qb => 
            qb.select(`${tableAlias}.productId,${tableAlias}.departmentId`)
              .addSelect("MAX(StoreHistory.id)", "id")
              .from(tableAlias, tableAlias)
              .leftJoin(`${tableAlias}.product`, 'product')
              .leftJoin('product.productBrand', 'brand')
              .leftJoin('product.productGroup', 'productGroup')
              .groupBy(`${tableAlias}.productId,${tableAlias}.departmentId`)
              .where(`DATE(${tableAlias}.createdDate) < '${filter.startDate}'`)
              .andWhere(queryString), 
            tableAlias, 
            `${tableAlias}.id = ${tableAlias}2.id`
          )
          .groupBy(`${tableAlias}2.productId`);
      
        if (orderBy) {
          query.orderBy(orderBy.column, orderBy.direction);
        }
      
        if (options) {
          query.offset(options.skip);
          query.limit(options.take);
        }
      
        if (whereClause) {
          query.andWhere(whereClause);
        }
      
        return query.getRawMany();
      }
      
}
