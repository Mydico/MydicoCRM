/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { OrderDTO } from './order.dto';


/**
 * A OrderDetails DTO object.
 */
export class OrderDetailsDTO extends BaseDTO {


    isDel: boolean;


    productId: number;


    detailId: number;


    quantity: number;


    price: number;


    storeId: number;


    priceTotal: number;


    reducePercent: number;


    priceReal: number;


    siteId: number;


    order: OrderDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
