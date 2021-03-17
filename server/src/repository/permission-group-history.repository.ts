import { EntityRepository, Repository } from 'typeorm';
import PermissionGroupHistory from '../domain/permission-group-history.entity';

@EntityRepository(PermissionGroupHistory)
export class PermissionGroupHistoryRepository extends Repository<PermissionGroupHistory> {}
