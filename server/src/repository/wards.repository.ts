import { EntityRepository, Repository } from 'typeorm';
import Wards from '../domain/wards.entity';

@EntityRepository(Wards)
export class WardsRepository extends Repository<Wards> {}
