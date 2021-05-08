/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { PermissionStatus } from '../../domain/enumeration/permission-status';


/**
 * A Permission DTO object.
 */
export class PermissionDTO extends BaseDTO {

            
        description: string;

            
        action: string;

            
        type: string;

            
        typeName: string;

            
        resource: string;

            
        status: PermissionStatus;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
