import IncomeDashboard from '../domain/income-dashboard.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(IncomeDashboard)
export class IncomeDashboardRepository extends Repository<IncomeDashboard> {}
