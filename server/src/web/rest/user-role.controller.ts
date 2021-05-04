import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import UserRole from '../../domain/user-role.entity';
import { UserRoleService } from '../../service/user-role.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-roles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class UserRoleController {
    logger = new Logger('UserRoleController');

    constructor(private readonly userRoleService: UserRoleService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: UserRole,
    })
    async getAll(@Req() req: Request): Promise<UserRole[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.userRoleService.findAndCount({
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
        type: UserRole,
    })
    async getOne(@Param('id') id: string): Promise<UserRole> {
        return await this.userRoleService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: UserRole,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() userRole: UserRole): Promise<UserRole> {
        const created = await this.userRoleService.save(userRole);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'UserRole', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: UserRole,
    })
    async put(@Req() req: Request, @Body() userRole: UserRole): Promise<UserRole> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'UserRole', userRole.id);
        return await this.userRoleService.update(userRole);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<UserRole> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'UserRole', id);
        const toDelete = await this.userRoleService.findById(id);
        return await this.userRoleService.delete(toDelete);
    }
}
