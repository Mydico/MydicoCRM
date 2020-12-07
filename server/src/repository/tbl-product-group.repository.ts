import { EntityRepository, Repository } from 'typeorm';
import TblProductGroup from '../domain/tbl-product-group.entity';

@EntityRepository(TblProductGroup)
export class TblProductGroupRepository extends Repository<TblProductGroup> {}
