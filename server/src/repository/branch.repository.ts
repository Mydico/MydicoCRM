import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import Branch from '../domain/branch.entity';

@EntityRepository(Branch)
export class BranchRepository extends TreeRepository<Branch> {}
