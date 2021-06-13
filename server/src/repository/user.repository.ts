import { EntityRepository, Repository } from 'typeorm';
import { User } from '../domain/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async removeCache(key: string[]) {
    return await this.manager.connection.queryResultCache.remove(key);
  }
}
