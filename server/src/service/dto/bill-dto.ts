import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import Customer from '../../domain/customer.entity';
import Order from '../../domain/order.entity';

export class CreateBillDTO {
    @ApiModelProperty({ description: 'User password', required: true })
    code: string;

    @ApiModelProperty({ description: 'User remember login', required: false })
    customer: Customer;

    @ApiModelProperty({ description: 'User login name', required: true })
    order: Order;
}
