import { EntityRepository, Repository } from 'typeorm';
import TblDistrict from '../domain/tbl-district.entity';

@EntityRepository(TblDistrict)
export class TblDistrictRepository extends Repository<TblDistrict> {}
