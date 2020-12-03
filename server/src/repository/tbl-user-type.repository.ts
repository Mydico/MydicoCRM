import { EntityRepository, Repository } from 'typeorm';
import TblUserType from '../domain/tbl-user-type.entity';

@EntityRepository(TblUserType)
export class TblUserTypeRepository extends Repository<TblUserType> {}
