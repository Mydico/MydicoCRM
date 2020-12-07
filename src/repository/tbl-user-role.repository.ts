import { EntityRepository, Repository } from 'typeorm';
import TblUserRole from '../domain/tbl-user-role.entity';

@EntityRepository(TblUserRole)
export class TblUserRoleRepository extends Repository<TblUserRole> {}
