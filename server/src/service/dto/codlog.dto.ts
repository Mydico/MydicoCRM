/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A Codlog DTO object.
 */
export class CodlogDTO extends BaseDTO {


    transportId: number;

    @MaxLength(255)

    content: string;


    time: number;


    orderId: number;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
