/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A CustomerStatus DTO object.
 */
export class CustomerStatusDTO extends BaseDTO {

    @MaxLength(255)

    name: string;

    @MaxLength(255)

    desc: string;


    isDel: boolean;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
