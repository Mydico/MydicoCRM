import { EntityRepository, Repository } from 'typeorm';
import OrderPush from '../domain/order-push.entity';

@EntityRepository(OrderPush)
export class OrderPushRepository extends Repository<OrderPush> {}
