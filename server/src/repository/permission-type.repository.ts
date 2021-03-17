import { EntityRepository, Repository } from 'typeorm';
import PermissionType from '../domain/permission-type.entity';

@EntityRepository(PermissionType)
export class PermissionTypeRepository extends Repository<PermissionType> {}
