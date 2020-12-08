import { EntityRepository, Repository } from 'typeorm';
import UserRole from '../domain/user-role.entity';

@EntityRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {}
