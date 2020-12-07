import { EntityRepository, Repository } from 'typeorm';
import TblAttributeMap from '../domain/tbl-attribute-map.entity';

@EntityRepository(TblAttributeMap)
export class TblAttributeMapRepository extends Repository<TblAttributeMap> {}
