import { EntityRepository, Repository } from 'typeorm';
import TblReportCustomerCategoryDate from '../domain/tbl-report-customer-category-date.entity';

@EntityRepository(TblReportCustomerCategoryDate)
export class TblReportCustomerCategoryDateRepository extends Repository<TblReportCustomerCategoryDate> {}
