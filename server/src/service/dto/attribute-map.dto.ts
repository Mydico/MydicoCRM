/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ProductDetailsDTO } from './product-details.dto';
import { AttributeValueDTO } from './attribute-value.dto';


/**
 * A AttributeMap DTO object.
 */
export class AttributeMapDTO extends BaseDTO {


    siteId: number;


    detail: ProductDetailsDTO;


    value: AttributeValueDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
