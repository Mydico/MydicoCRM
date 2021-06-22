/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A UserDeviceToken DTO object.
 */
export class UserDeviceTokenDTO extends BaseDTO {

    /**
     * id user management
     */
    @IsNotEmpty()

    userId: number;

    /**
     * token nhận notify push theo từng device
     */
    @MaxLength(255)

    deviceToken: string;


    createdAt: number;


    updatedAt: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
