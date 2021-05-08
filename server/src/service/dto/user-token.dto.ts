/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A UserToken DTO object.
 */
export class UserTokenDTO extends BaseDTO {

            
        type: boolean;

            @MaxLength(255)
            
        token: string;

            @MaxLength(255)
            
        tokenHash: string;

            
        expiredAt: number;

            
        createdAt: number;

            
        updatedAt: number;

            @IsNotEmpty()
            
        userId: number;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
