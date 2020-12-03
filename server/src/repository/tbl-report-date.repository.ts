import { EntityRepository, Repository } from 'typeorm';
import TblReportDate from '../domain/tbl-report-date.entity';

@EntityRepository(TblReportDate)
export class TblReportDateRepository extends Repository<TblReportDate> {}
