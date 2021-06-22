/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ProductDTO } from './product.dto';
import { CustomerTypeDTO } from './customer-type.dto';
import { FanpageDTO } from './fanpage.dto';


/**
 * A CustomerRequest DTO object.
 */
export class CustomerRequestDTO extends BaseDTO {

    @MaxLength(255)

    name: string;

    @MaxLength(100)

    tel: string;

    @MaxLength(255)

    node: string;


    isDel: boolean;


    userId: number;

    @MaxLength(250)

    email: string;

    /**
     * trạng thái xử lý
     */

    status: boolean;


    siteId: number;


    product: ProductDTO;


    type: CustomerTypeDTO;


    fanpage: FanpageDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
