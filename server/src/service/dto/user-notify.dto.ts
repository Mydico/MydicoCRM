/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


/**
 * A UserNotify DTO object.
 */
export class UserNotifyDTO extends BaseDTO {


    userId: number;

    @MaxLength(255)

    title: string;

    @MaxLength(255)

    content: string;

    /**
     * 0 - chưa đọc, 1 - đã đọc
     */

    isRead: number;


    createdAt: number;


    updatedAt: number;


    type: number;

    @IsNotEmpty()

    referenceId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
