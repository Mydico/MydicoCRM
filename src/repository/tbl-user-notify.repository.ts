import { EntityRepository, Repository } from 'typeorm';
import TblUserNotify from '../domain/tbl-user-notify.entity';

@EntityRepository(TblUserNotify)
export class TblUserNotifyRepository extends Repository<TblUserNotify> {}
