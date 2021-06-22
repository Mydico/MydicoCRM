/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A UserType DTO object.
 */
export class UserTypeDTO extends BaseDTO {
    @MaxLength(255)
    name: string;

    percent: number;

    isDel: boolean;

    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
