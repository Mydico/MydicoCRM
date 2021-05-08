/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { PermissionGroupStatus } from '../../domain/enumeration/permission-group-status';


/**
 * A PermissionType DTO object.
 */
export class PermissionTypeDTO extends BaseDTO {

            
        description: string;

            
        name: string;

            
        status: PermissionGroupStatus;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
