/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { AttributeDTO } from './attribute.dto';


/**
 * A AttributeValue DTO object.
 */
export class AttributeValueDTO extends BaseDTO {

    @IsNotEmpty()
    @MaxLength(255)

    name: string;


    productId: number;


    isDel: boolean;


    siteId: number;


    attribute: AttributeDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
