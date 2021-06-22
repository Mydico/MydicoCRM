/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { StoreDTO } from './store.dto';
import { ProductDetailsDTO } from './product-details.dto';


/**
 * A ProductQuantity DTO object.
 */
export class ProductQuantityDTO extends BaseDTO {

    @IsNotEmpty()

    quantity: number;


    isDel: boolean;


    store: StoreDTO;


    detail: ProductDetailsDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
