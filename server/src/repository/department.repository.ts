import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import Department from '../domain/department.entity';

@EntityRepository(Department)
export class DepartmentRepository extends TreeRepository<Department> {}
