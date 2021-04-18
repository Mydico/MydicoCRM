import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Permission from '../../domain/permission.entity';
import { PermissionService } from '../../service/permission.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/permissions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('permissions')
export class PermissionController {
    logger = new Logger('PermissionController');

    constructor(private readonly permissionService: PermissionService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Permission,
    })
    async getAll(@Req() req: Request): Promise<Permission[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.permissionService.findAndCount({
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
        type: Permission,
    })
    async getOne(@Param('id') id: string): Promise<Permission> {
        return await this.permissionService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create permission' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Permission,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() permission: Permission): Promise<Permission> {
        const created = await this.permissionService.save(permission);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Permission', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update permission' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Permission,
    })
    async put(@Req() req: Request, @Body() permission: Permission): Promise<Permission> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Permission', permission.id);
        return await this.permissionService.update(permission);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete permission' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Permission> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Permission', id);
        const toDelete = await this.permissionService.findById(id);
        return await this.permissionService.delete(toDelete);
    }
}
