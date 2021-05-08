/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A Order DTO object.
 */
export class OrderDTO extends BaseDTO {

        

            
        isDel: boolean;

            
        customerId: number;

            @MaxLength(255)
            
        customerName: string;

            @MaxLength(255)
            
        customerTel: string;

            
        cityId: number;

            
        districtId: number;

            
        wardsId: number;

            @MaxLength(255)
            
        address: string;

            @MaxLength(255)
            
        codCode: string;

            
        status: number;

            
        storeId: number;

            
        transportId: number;

        /**
     * tổng tiền
     */
            
        totalMoney: number;

            @MaxLength(255)
            
        summary: string;

            
        requestId: number;

            @MaxLength(500)
            
        note: string;

            @MaxLength(250)
            
        customerNote: string;

            
        pushStatus: boolean;

            
        promotionId: number;

            
        promotionItemId: number;

            
        realMoney: number;

            
        reduceMoney: number;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
