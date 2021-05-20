import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import PermissionGroupAssociate from '../../domain/permission-group-associate.entity';
import { PermissionGroupAssociateService } from '../../service/permission-group-associate.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/permission-group-associates')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class PermissionGroupAssociateController {
    logger = new Logger('PermissionGroupAssociateController');

    constructor(private readonly permissionGroupAssociateService: PermissionGroupAssociateService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PermissionGroupAssociate,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<PermissionGroupAssociate[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.permissionGroupAssociateService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PermissionGroupAssociate,
    })
    async getOne(@Param('id') id: string): Promise<PermissionGroupAssociate> {
        return await this.permissionGroupAssociateService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PermissionGroupAssociate,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate> {
        const created = await this.permissionGroupAssociateService.save(permissionGroupAssociate);
        HeaderUtil.addEntityCreatedHeaders(res, 'PermissionGroupAssociate', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PermissionGroupAssociate,
    })
    async put(@Res() res: Response, @Body() permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate> {
        HeaderUtil.addEntityCreatedHeaders(res, 'PermissionGroupAssociate', permissionGroupAssociate.id);
        return await this.permissionGroupAssociateService.update(permissionGroupAssociate);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<PermissionGroupAssociate> {
        HeaderUtil.addEntityDeletedHeaders(res, 'PermissionGroupAssociate', id);
        const toDelete = await this.permissionGroupAssociateService.findById(id);
        return await this.permissionGroupAssociateService.delete(toDelete);
    }
}
