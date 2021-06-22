/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A Bill DTO object.
 */
export class BillDTO extends BaseDTO {

    @IsNotEmpty()

    customerId: number;

    @IsNotEmpty()

    orderId: number;

    @IsNotEmpty()

    storeId: number;

    /**
     * 0 : khởi tạo chờ duyệt, -1 : hủy duyệt, 1: duyệt đơn và xuất kho, trừ số lượng trong kho (không hủy được nữa), 2 : đang vận chuyển , 3 : giao thành công (tạo công nợ cho khách), 4 : khách hủy đơn (phải tạo dơn nhập lại hàng vào kho)
     */

    status: number;


    isDel: boolean;

    @MaxLength(255)

    note: string;


    /**
     * mã vận đơn
     */
    @MaxLength(255)

    code: string;


    saleId: number;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
