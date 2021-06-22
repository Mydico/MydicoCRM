/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A Migration DTO object.
 */
export class MigrationDTO extends BaseDTO {

    @IsNotEmpty()
    @MaxLength(180)

    version: string;


    applyTime: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
