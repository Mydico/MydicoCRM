/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A Promotion DTO object.
 */
export class PromotionDTO extends BaseDTO {

            
        startTime: number;

            
        endTime: number;

            @MaxLength(255)
            
        name: string;

            @MaxLength(512)
            
        description: string;

            
        totalRevenue: number;

            
        customerTargetType: number;


            
        siteId: number;

            @MaxLength(255)
            
        image: string;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
