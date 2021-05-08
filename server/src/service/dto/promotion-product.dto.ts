/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { ProductDTO } from './product.dto';
import { PromotionDTO } from './promotion.dto';


/**
 * A PromotionProduct DTO object.
 */
export class PromotionProductDTO extends BaseDTO {

            
        buy: number;

            
        gift: number;


        
        product: ProductDTO;

        
        promotion: PromotionDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
