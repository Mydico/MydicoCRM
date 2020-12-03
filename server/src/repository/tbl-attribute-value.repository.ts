import { EntityRepository, Repository } from 'typeorm';
import TblAttributeValue from '../domain/tbl-attribute-value.entity';

@EntityRepository(TblAttributeValue)
export class TblAttributeValueRepository extends Repository<TblAttributeValue> {}
