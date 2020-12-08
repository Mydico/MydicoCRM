import { EntityRepository, Repository } from 'typeorm';
import ReportCustomerCategoryDate from '../domain/report-customer-category-date.entity';

@EntityRepository(ReportCustomerCategoryDate)
export class ReportCustomerCategoryDateRepository extends Repository<ReportCustomerCategoryDate> {}
