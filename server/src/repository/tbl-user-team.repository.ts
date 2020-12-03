import { EntityRepository, Repository } from 'typeorm';
import TblUserTeam from '../domain/tbl-user-team.entity';

@EntityRepository(TblUserTeam)
export class TblUserTeamRepository extends Repository<TblUserTeam> {}
