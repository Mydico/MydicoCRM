/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A Fanpage DTO object.
 */
export class FanpageDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

            @MaxLength(255)
            
        link: string;

        

            
        isDel: boolean;

            @MaxLength(255)
            
        code: string;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
