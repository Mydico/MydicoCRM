/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { CityDTO } from './city.dto';


/**
 * A District DTO object.
 */
export class DistrictDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

            


            
        isDel: boolean;

            
        storeId: number;

            @MaxLength(250)
            
        codIds: string;


        
        city: CityDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
