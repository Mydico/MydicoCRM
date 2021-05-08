/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A ReportDate DTO object.
 */
export class ReportDateDTO extends BaseDTO {

        /**
     * báo cáo ngày
     */
            @IsNotEmpty()
            
        date: number;

        /**
     * chi nhánh
     */
            
        siteId: number;

        /**
     * nhân viên
     */
            
        saleId: number;

            
        totalMoney: number;

            
        realMoney: number;

            
        reduceMoney: number;

            
        createdAt: number;

            
        updatedAt: number;

            
        teamId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
