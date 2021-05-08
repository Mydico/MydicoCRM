/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { DepartmentStatus } from '../../domain/enumeration/department-status';


/**
 * A Department DTO object.
 */
export class DepartmentDTO extends BaseDTO {

            
        name: string;

            
        status: DepartmentStatus;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
