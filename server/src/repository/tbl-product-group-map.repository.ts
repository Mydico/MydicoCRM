import { EntityRepository, Repository } from 'typeorm';
import TblProductGroupMap from '../domain/tbl-product-group-map.entity';

@EntityRepository(TblProductGroupMap)
export class TblProductGroupMapRepository extends Repository<TblProductGroupMap> {}
