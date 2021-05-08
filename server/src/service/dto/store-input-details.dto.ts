/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { StoreInputDTO } from './store-input.dto';
import { ProductDetailsDTO } from './product-details.dto';


/**
 * A StoreInputDetails DTO object.
 */
export class StoreInputDetailsDTO extends BaseDTO {

            
        quantity: number;

            
        isDel: boolean;

            
        price: number;

            
        siteId: number;


        
        nhapkho: StoreInputDTO;

        
        chitiet: ProductDetailsDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
