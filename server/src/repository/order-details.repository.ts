import { EntityRepository, Repository } from 'typeorm';
import OrderDetails from '../domain/order-details.entity';

@EntityRepository(OrderDetails)
export class OrderDetailsRepository extends Repository<OrderDetails> {}
