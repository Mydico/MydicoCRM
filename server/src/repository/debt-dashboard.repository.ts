import { EntityRepository, Repository } from 'typeorm';
import DebtDashboard from '../domain/debt-dashboard.entity';

@EntityRepository(DebtDashboard)
export class DebtDashboardRepository extends Repository<DebtDashboard> {}
