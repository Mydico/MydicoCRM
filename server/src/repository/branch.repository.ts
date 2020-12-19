import { EntityRepository, Repository } from 'typeorm';
import Branch from '../domain/branch.entity';

@EntityRepository(Branch)
export class BranchRepository extends Repository<Branch> {}
