import { EntityRepository, Repository } from 'typeorm';
import PermissionGroupAssociate from '../domain/permission-group-associate.entity';

@EntityRepository(PermissionGroupAssociate)
export class PermissionGroupAssociateRepository extends Repository<PermissionGroupAssociate> {}
