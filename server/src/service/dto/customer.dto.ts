/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { CityDTO } from './city.dto';
import { BranchDTO } from './branch.dto';
import { DistrictDTO } from './district.dto';
import { WardsDTO } from './wards.dto';
import { FanpageDTO } from './fanpage.dto';
import { CustomerSkinDTO } from './customer-skin.dto';
import { CustomerCategoryDTO } from './customer-category.dto';
import { CustomerStatusDTO } from './customer-status.dto';
import { CustomerTypeDTO } from './customer-type.dto';
import { CustomerRequestDTO } from './customer-request.dto';

import { UserDTO } from './user.dto';

/**
 * A Customer DTO object.
 */
export class CustomerDTO extends BaseDTO {

            @MaxLength(255)
            
        name: string;

            @MaxLength(100)
            
        tel: string;

            @MaxLength(255)
            
        address: string;

        /**
     * năm sinh
     */
            
        yearOfBirth: number;

            
        obclubJoinTime: number;

        /**
     * chiều cao (cm)
     */
            
        estimateRevenueMonth: number;

        /**
     * cân nặng(kg)
     */
            
        capacity: number;

        /**
     * tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)
     */
            
        marriage: boolean;

            
        isDel: boolean;

            
        activated: boolean;

            @MaxLength(250)
            
        email: string;

            
        level: number;

            @IsNotEmpty()
    @MaxLength(256)
            
        code: string;

            @IsNotEmpty()
    @MaxLength(256)
            
        contactName: string;

            @MaxLength(500)
            
        note: string;

            
        contactYearOfBirth: number;

            
        totalDebt: number;

            
        earlyDebt: number;

            
        siteId: number;


        
        city: CityDTO;

        
        branch: BranchDTO;

        
        district: DistrictDTO;

        
        ward: WardsDTO;

        
        fanpage: FanpageDTO;

        
        skin: CustomerSkinDTO;

        
        category: CustomerCategoryDTO;

        
        status: CustomerStatusDTO;

        
        type: CustomerTypeDTO;

        
        request: CustomerRequestDTO;

        
        users: UserDTO[];

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
