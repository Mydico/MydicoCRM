import { EntityRepository, Repository } from 'typeorm';
import TblUser from '../domain/tbl-user.entity';

@EntityRepository(TblUser)
export class TblUserRepository extends Repository<TblUser> {}
