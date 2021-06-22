/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


/**
 * A CustomerMap DTO object.
 */
export class CustomerMapDTO extends BaseDTO {


    customerId: number;


    userId: number;


    siteId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
