import { EntityRepository, Repository } from 'typeorm';
import TblAttribute from '../domain/tbl-attribute.entity';

@EntityRepository(TblAttribute)
export class TblAttributeRepository extends Repository<TblAttribute> {}
