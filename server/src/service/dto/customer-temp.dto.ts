/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A CustomerTemp DTO object.
 */
export class CustomerTempDTO extends BaseDTO {

    @MaxLength(255)

    name: string;

    @MaxLength(100)

    tel: string;

    @MaxLength(255)

    address: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
