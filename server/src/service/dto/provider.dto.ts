/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { StoreInputDTO } from './store-input.dto';


/**
 * A Provider DTO object.
 */
export class ProviderDTO extends BaseDTO {


    name: string;


    address: string;


    phone: string;


    storeInput: StoreInputDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
