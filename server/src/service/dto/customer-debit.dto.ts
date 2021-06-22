/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { CustomerDTO } from './customer.dto';

import { UserDTO } from './user.dto';

/**
 * A CustomerDebit DTO object.
 */
export class CustomerDebitDTO extends BaseDTO {


    debt: number;


    customer: CustomerDTO;


    sale: UserDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
