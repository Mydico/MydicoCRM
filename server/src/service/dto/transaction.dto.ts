/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A Transaction DTO object.
 */
export class TransactionDTO extends BaseDTO {

            @IsNotEmpty()
            
        customerId: number;

            
        orderId: number;

            
        storeId: number;

            
        billId: number;

        /**
     * 0 : chưa thanh toán, 1 : đã thanh toán
     */
            
        status: number;

            
        isDel: boolean;

            @MaxLength(255)
            
        note: string;

            

            
        saleId: number;

            
        totalMoney: number;

        /**
     * Số tiền hòa trả do trả hàng
     */
            
        refundMoney: number;

        /**
     * 0 : ghi nợ, 1 : thu công nợ, 2 thu tiền mặt
     */
            
        type: number;

        /**
     * công nợ đầu kỳ
     */
            
        earlyDebt: number;

        /**
     * ghi nợ
     */
            
        debit: number;

        /**
     * ghi có
     */
            
        debitYes: number;

        /**
     * id phiếu thu
     */
            
        receiptId: number;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
