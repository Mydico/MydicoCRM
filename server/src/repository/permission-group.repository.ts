import { EntityRepository, Repository } from 'typeorm';
import PermissionGroup from '../domain/permission-group.entity';

@EntityRepository(PermissionGroup)
export class PermissionGroupRepository extends Repository<PermissionGroup> {}
