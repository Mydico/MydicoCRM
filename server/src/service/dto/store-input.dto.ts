/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { StoreDTO } from './store.dto';


/**
 * A StoreInput DTO object.
 */
export class StoreInputDTO extends BaseDTO {

            
        isDel: boolean;

            @MaxLength(255)
            
        summary: string;

        /**
     * Kiểu nhập kho : 0 - Nhập mới, 1 - Nhập trả
     */
            
        type: number;

        /**
     * Trạng thái đơn nhập : 0 - Chưa duyệt, 1 - Đã duyệt, 2 - Hủy duyệt
     */
            
        status: number;

            
        customerId: number;

            
        orderId: number;

            
        totalMoney: number;

            @MaxLength(255)
            
        note: string;

            
        siteId: number;


        
        storeOutput: StoreDTO;

        
        storeInput: StoreDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
