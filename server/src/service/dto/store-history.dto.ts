/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { ProductDTO } from './product.dto';
import { StoreDTO } from './store.dto';


/**
 * A StoreHistory DTO object.
 */
export class StoreHistoryDTO extends BaseDTO {


    quantity: number;


    note: string;


    product: ProductDTO;


    store: StoreDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
