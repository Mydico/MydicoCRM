import { EntityRepository, Repository } from 'typeorm';
import TblUserDeviceToken from '../domain/tbl-user-device-token.entity';

@EntityRepository(TblUserDeviceToken)
export class TblUserDeviceTokenRepository extends Repository<TblUserDeviceToken> {}
