/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A ProductGroupMap DTO object.
 */
export class ProductGroupMapDTO extends BaseDTO {

    @IsNotEmpty()

    groupId: number;

    @IsNotEmpty()

    productId: number;


    createdAt: number;

    @MaxLength(255)

    createdBy: string;


    updatedAt: number;

    @MaxLength(255)

    updatedBy: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
