import { EntityRepository, Repository } from 'typeorm';
import UserTeam from '../domain/user-team.entity';

@EntityRepository(UserTeam)
export class UserTeamRepository extends Repository<UserTeam> {}
