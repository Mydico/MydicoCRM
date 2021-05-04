
import { IsString } from 'class-validator';
import Customer from '../../domain/customer.entity';
import Order from '../../domain/order.entity';

export class CreateBillDTO {
    
    code: string;

    
    customer: Customer;

    
    order: Order;
}
