/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A PromotionItem DTO object.
 */
export class PromotionItemDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

            
        totalMoney: number;

            
        reducePercent: number;

            @MaxLength(512)
            
        note: string;

            
        productGroupId: number;

            
        promotionId: number;

            
        createdAt: number;

            
        updatedAt: number;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
