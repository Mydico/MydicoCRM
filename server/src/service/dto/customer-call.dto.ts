/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A CustomerCall DTO object.
 */
export class CustomerCallDTO extends BaseDTO {

    /**
     * trạng thái (đã chốt đơn, chưa chốt yêu cầu)
     */

    statusId: number;

    /**
     * ghi chú
     */
    @MaxLength(255)

    comment: string;


    customerId: number;


    isDel: boolean;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
