/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


/**
 * A PromotionCustomerLevel DTO object.
 */
export class PromotionCustomerLevelDTO extends BaseDTO {


    customerId: number;


    promotionId: number;


    promotionItemId: number;


    totalMoney: number;


    updatedAt: number;


    createdAt: number;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
