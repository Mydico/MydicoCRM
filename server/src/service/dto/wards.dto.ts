/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { DistrictDTO } from './district.dto';


/**
 * A Wards DTO object.
 */
export class WardsDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

        

            
        isDel: boolean;


        
        district: DistrictDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
