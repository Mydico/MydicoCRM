/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A UserRole DTO object.
 */
export class UserRoleDTO extends BaseDTO {

            @IsNotEmpty()
    @MaxLength(255)
            
        name: string;

            @IsNotEmpty()
    @MaxLength(255)
            
        permission: string;

            
        siteId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
