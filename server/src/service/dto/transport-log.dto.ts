/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A TransportLog DTO object.
 */
export class TransportLogDTO extends BaseDTO {

        /**
     * User vận chuyển đơn hàng
     */
            @IsNotEmpty()
            
        userId: number;

            @IsNotEmpty()
            
        customerId: number;

            @IsNotEmpty()
            
        orderId: number;

            @IsNotEmpty()
            
        billId: number;

            @IsNotEmpty()
            
        storeId: number;

        /**
     * 1: Đang vận chuyển, 2 : đã giao cho khách , 3 : khách không nhận hàng (chuyển lại về kho), 4 : Đã trả về kho
     */
            
        status: number;

            
        isDel: boolean;

            @MaxLength(255)
            
        note: string;

            
        createdAt: number;

            @MaxLength(255)
            
        createdBy: string;

            
        updatedAt: number;

            @MaxLength(255)
            
        updatedBy: string;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
