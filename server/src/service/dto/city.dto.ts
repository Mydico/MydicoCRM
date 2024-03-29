/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A City DTO object.
 */
export class CityDTO extends BaseDTO {

    @MaxLength(255)

    name: string;


    isDel: boolean;


    storeId: number;

    @MaxLength(250)

    codIds: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
