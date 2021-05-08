/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A ReportCustomerCategoryDate DTO object.
 */
export class ReportCustomerCategoryDateDTO extends BaseDTO {

        /**
     * báo cáo ngày
     */
            @IsNotEmpty()
            
        date: number;

        /**
     * nhóm khách hàng
     */
            
        categoryId: number;

        /**
     * chi nhánh
     */
            
        siteId: number;

            
        totalMoney: number;

            
        realMoney: number;

            
        reduceMoney: number;

            
        createdAt: number;

            
        updatedAt: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
