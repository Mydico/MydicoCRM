import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PermissionType from '../../domain/permission-type.entity';
import { PermissionTypeService } from '../../service/permission-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm/find-options/operator/Like';

@Controller('api/permission-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class PermissionTypeController {
    logger = new Logger('PermissionTypeController');

    constructor(private readonly permissionTypeService: PermissionTypeService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PermissionType,
    })
    async getAll(@Req() req: Request): Promise<PermissionType[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.permissionTypeService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                ...filter,
            },
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PermissionType,
    })
    async getOne(@Param('id') id: string): Promise<PermissionType> {
        return await this.permissionTypeService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PermissionType,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() permissionType: PermissionType): Promise<PermissionType> {
        const created = await this.permissionTypeService.save(permissionType);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionType', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PermissionType,
    })
    async put(@Req() req: Request, @Body() permissionType: PermissionType): Promise<PermissionType> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionType', permissionType.id);
        return await this.permissionTypeService.update(permissionType);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<PermissionType> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'PermissionType', id);
        const toDelete = await this.permissionTypeService.findById(id);
        return await this.permissionTypeService.delete(toDelete);
    }
}
