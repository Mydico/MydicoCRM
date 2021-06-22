/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ProductBrandDTO } from './product-brand.dto';


/**
 * A Product DTO object.
 */
export class ProductDTO extends BaseDTO {

    @IsNotEmpty()
    @MaxLength(255)

    name: string;

    @MaxLength(255)

    image: string;

    @MaxLength(255)

    desc: string;


    isDel: boolean;

    @MaxLength(255)

    code: string;


    status: number;

    /**
     * Giá gốc của sản phẩm tính theo đơn vị của sản phẩm
     */

    price: number;

    /**
     * Đơn vị của sản phẩm : 0 - Cái, 1 - Hộp, 2 - Chai , 3 - Túi , 4 - Tuýp , 5 - Hũ , 6 - Lọ, 7 - Cặp
     */

    unit: number;

    /**
     * Giá gốc của sản phẩm danh cho đại lý tính theo đơn vị của sản phẩm
     */

    agentPrice: number;


    productBrand: ProductBrandDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
