/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A Site DTO object.
 */
export class SiteDTO extends BaseDTO {

    @MaxLength(255)

    name: string;

    @MaxLength(255)

    address: string;


    createdAt: number;

    @MaxLength(255)

    createdBy: string;


    updatedAt: number;

    @MaxLength(255)

    updatedBy: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
