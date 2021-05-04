import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PermissionGroupHistory from '../../domain/permission-group-history.entity';
import { PermissionGroupHistoryService } from '../../service/permission-group-history.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/permission-group-histories')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class PermissionGroupHistoryController {
    logger = new Logger('PermissionGroupHistoryController');

    constructor(private readonly permissionGroupHistoryService: PermissionGroupHistoryService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PermissionGroupHistory,
    })
    async getAll(@Req() req: Request): Promise<PermissionGroupHistory[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.permissionGroupHistoryService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PermissionGroupHistory,
    })
    async getOne(@Param('id') id: string): Promise<PermissionGroupHistory> {
        return await this.permissionGroupHistoryService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PermissionGroupHistory,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() permissionGroupHistory: PermissionGroupHistory): Promise<PermissionGroupHistory> {
        const created = await this.permissionGroupHistoryService.save(permissionGroupHistory);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionGroupHistory', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PermissionGroupHistory,
    })
    async put(@Req() req: Request, @Body() permissionGroupHistory: PermissionGroupHistory): Promise<PermissionGroupHistory> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionGroupHistory', permissionGroupHistory.id);
        return await this.permissionGroupHistoryService.update(permissionGroupHistory);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<PermissionGroupHistory> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'PermissionGroupHistory', id);
        const toDelete = await this.permissionGroupHistoryService.findById(id);
        return await this.permissionGroupHistoryService.delete(toDelete);
    }
}
