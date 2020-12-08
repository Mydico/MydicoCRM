import { EntityRepository, Repository } from 'typeorm';
import UserDeviceToken from '../domain/user-device-token.entity';

@EntityRepository(UserDeviceToken)
export class UserDeviceTokenRepository extends Repository<UserDeviceToken> {}
