/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A OrderPush DTO object.
 */
export class OrderPushDTO extends BaseDTO {


    orderId: number;


    transportId: number;

    @MaxLength(255)

    repon: string;


    isDel: boolean;


    createdAt: number;


    updatedAt: number;

    /**
     * mã đơn hàng + random (để 1 đơn hàng push dc nhiều lần)
     */
    @MaxLength(100)

    code: string;

    /**
     * ghi chú nội dung cho tiện theo dõi
     */
    @MaxLength(255)

    note: string;


    status: number;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
