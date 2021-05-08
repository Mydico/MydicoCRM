/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ProductBrandDTO } from './product-brand.dto';


/**
 * A ProductGroup DTO object.
 */
export class ProductGroupDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

            @MaxLength(512)
            
        description: string;


        
        productBrand: ProductBrandDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
