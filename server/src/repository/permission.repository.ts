import { EntityRepository, Repository } from 'typeorm';
import Permission from '../domain/permission.entity';

@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {}
