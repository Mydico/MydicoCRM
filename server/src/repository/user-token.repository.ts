import { EntityRepository, Repository } from 'typeorm';
import UserToken from '../domain/user-token.entity';

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {}
