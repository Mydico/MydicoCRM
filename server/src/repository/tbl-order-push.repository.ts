import { EntityRepository, Repository } from 'typeorm';
import TblOrderPush from '../domain/tbl-order-push.entity';

@EntityRepository(TblOrderPush)
export class TblOrderPushRepository extends Repository<TblOrderPush> {}
