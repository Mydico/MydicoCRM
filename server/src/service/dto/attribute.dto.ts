/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ProductDTO } from './product.dto';


/**
 * A Attribute DTO object.
 */
export class AttributeDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

            


            
        isDel: boolean;

            
        siteId: number;


        
        product: ProductDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
