import { EntityRepository, Repository } from 'typeorm';
import District from '../domain/district.entity';

@EntityRepository(District)
export class DistrictRepository extends Repository<District> {}
