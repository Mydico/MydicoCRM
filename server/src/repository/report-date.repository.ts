import { EntityRepository, Repository } from 'typeorm';
import ReportDate from '../domain/report-date.entity';

@EntityRepository(ReportDate)
export class ReportDateRepository extends Repository<ReportDate> {}
