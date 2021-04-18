import { IsArray, IsString, MinLength, IsUUID, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { User } from '../../domain/user.entity';
import { PermissionGroupStatus } from '../../domain/enumeration/permission-group-status';
import { ApiModelProperty } from '@nestjs/swagger';
import Permission from '../../domain/permission.entity';


export class CreatePermissionGroupDTO {
    @ApiModelProperty({ required: true })
    @IsString()
    @MaxLength(150)
    readonly name: string;

    @ApiModelProperty({ required: true })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    readonly note: string;

    @ApiModelProperty({ required: true })
    @IsString()
    @IsOptional()
    createdBy: string;

    @ApiModelProperty({ required: true })
    @IsEnum(PermissionGroupStatus)
    @IsOptional()
    readonly status: PermissionGroupStatus;

    @ApiModelProperty({ required: true })
    @IsOptional()
    @IsArray()
    readonly permissions: Permission[];

    @ApiModelProperty({ required: true })
    @IsOptional()
    @IsArray()
    readonly users?: User[];

}


export class UpdatePermissionGroupDTO {

    @ApiModelProperty({ required: true })
    @IsUUID()
    readonly id: string;

    @ApiModelProperty({ required: true })
    @IsOptional()
    @IsString()
    readonly name: string;

    @ApiModelProperty({ required: true })
    @IsOptional()
    @IsString()
    readonly note: string;

    @ApiModelProperty({ required: true })
    @IsString()
    @IsOptional()
    createdBy: string;

    @ApiModelProperty({ required: true })
    @IsEnum(PermissionGroupStatus)
    @IsOptional()
    readonly status: PermissionGroupStatus;

    @ApiModelProperty({ required: true })
    @IsOptional()
    @IsArray()
    readonly permissions?: Permission[];

    @ApiModelProperty({ required: true })
    @IsOptional()
    @IsArray()
    readonly users?: User[];
}
