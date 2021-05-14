import { IsArray, IsString, MinLength, IsUUID, IsOptional, MaxLength, IsEnum, IsNumber } from 'class-validator';
import { User } from '../../domain/user.entity';
import { PermissionGroupStatus } from '../../domain/enumeration/permission-group-status';

import Permission from '../../domain/permission.entity';


export class CreatePermissionGroupDTO {
    
    @IsString()
    @MaxLength(150)
    readonly name: string;

    
    @IsString()
    @IsOptional()
    @MaxLength(255)
    readonly note: string;

    
    @IsString()
    @IsOptional()
    createdBy: string;

    
    @IsEnum(PermissionGroupStatus)
    @IsOptional()
    readonly status: PermissionGroupStatus;

    
    @IsOptional()
    @IsArray()
    readonly permissions: Permission[];

    
    @IsOptional()
    @IsArray()
    readonly users?: User[];

}


export class UpdatePermissionGroupDTO {

    
    @IsNumber()
    readonly id: string;

    
    @IsOptional()
    @IsString()
    readonly name: string;

    
    @IsOptional()
    @IsString()
    readonly note: string;

    
    @IsString()
    @IsOptional()
    createdBy: string;

    
    @IsEnum(PermissionGroupStatus)
    @IsOptional()
    readonly status: PermissionGroupStatus;

    
    @IsOptional()
    @IsArray()
    readonly permissions?: Permission[];

    
    @IsOptional()
    @IsArray()
    readonly users?: User[];
}
