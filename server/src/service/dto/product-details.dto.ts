/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ProductDTO } from './product.dto';


/**
 * A ProductDetails DTO object.
 */
export class ProductDetailsDTO extends BaseDTO {

    @MaxLength(255)

    barcode: string;


    isDel: boolean;

    @MaxLength(250)

    name: string;


    product: ProductDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
