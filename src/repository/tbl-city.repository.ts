import { EntityRepository, Repository } from 'typeorm';
import TblCity from '../domain/tbl-city.entity';

@EntityRepository(TblCity)
export class TblCityRepository extends Repository<TblCity> {}
