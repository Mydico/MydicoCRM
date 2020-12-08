import { EntityRepository, Repository } from 'typeorm';
import UserNotify from '../domain/user-notify.entity';

@EntityRepository(UserNotify)
export class UserNotifyRepository extends Repository<UserNotify> {}
