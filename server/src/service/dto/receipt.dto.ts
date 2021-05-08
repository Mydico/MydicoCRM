/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A Receipt DTO object.
 */
export class ReceiptDTO extends BaseDTO {

            @IsNotEmpty()
            
        customerId: number;

        /**
     * mã phiếu thu (số phiếu thu)
     */
            @MaxLength(255)
            
        code: string;

        /**
     * 0 :un active, 1 : active
     */
            
        status: number;

            
        isDel: boolean;

            @MaxLength(255)
            
        note: string;

        /**
     * Số tiền thu được của khách hàng
     */
            
        money: number;

        /**
     * 0 - Thu từ công nợ, 1 - Trừ công nợ do trả hàng
     */
            
        type: number;

        /**
     * đơn trả hàng
     */
            
        storeInputId: number;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
