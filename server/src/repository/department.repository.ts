import { EntityRepository, Repository } from 'typeorm';
import Department from '../domain/department.entity';

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {}
