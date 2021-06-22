/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { CityDTO } from './city.dto';
import { DistrictDTO } from './district.dto';
import { WardsDTO } from './wards.dto';


/**
 * A Store DTO object.
 */
export class StoreDTO extends BaseDTO {

    @IsNotEmpty()
    @MaxLength(255)

    name: string;

    @MaxLength(255)

    address: string;

    @MaxLength(100)

    tel: string;


    isDel: boolean;


    transportId: number;


    siteId: number;


    city: CityDTO;


    district: DistrictDTO;


    wards: WardsDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
