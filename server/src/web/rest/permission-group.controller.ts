import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PermissionGroup from '../../domain/permission-group.entity';
import { PermissionGroupService } from '../../service/permission-group.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { CreatePermissionGroupDTO, UpdatePermissionGroupDTO } from '../../service/dto/permission-group.dto';

@Controller('api/permission-groups')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class PermissionGroupController {
    logger = new Logger('PermissionGroupController');

    constructor(private readonly permissionGroupService: PermissionGroupService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PermissionGroup,
    })
    async getAll(@Req() req: Request): Promise<PermissionGroup[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.permissionGroupService.findAndCount({
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
        type: PermissionGroup,
    })
    async getOne(@Param('id') id: string): Promise<PermissionGroup> {
        return await this.permissionGroupService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PermissionGroup,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() permissionGroup: CreatePermissionGroupDTO): Promise<PermissionGroup> {
        const currentUser = req.user as User;
        permissionGroup.createdBy = currentUser.login;
        if (await this.permissionGroupService.findByName(permissionGroup.name.trim())  )
        {throw new HttpException('NameExisted', HttpStatus.CONFLICT);}
        const created = await this.permissionGroupService.save(permissionGroup);
        await this.permissionGroupService.updateDependency(permissionGroup.permissions, created, permissionGroup.users);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionGroup', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PermissionGroup,
    })
    async put(@Req() req: Request, @Body() permissionGroup: UpdatePermissionGroupDTO): Promise<PermissionGroup> {
        HeaderUtil.addEntityUpdatedHeaders(req.res, 'PermissionGroup', permissionGroup.name);
        const currentUser = req.user as User;
        permissionGroup.createdBy = currentUser.login;
        const check = await this.permissionGroupService.findByName(permissionGroup.name.trim());
        if( check && check.id !== permissionGroup.id )
        {throw new HttpException('NameExisted',HttpStatus.CONFLICT);}
        this.permissionGroupService.updateDependency(permissionGroup.permissions, permissionGroup, permissionGroup.users);
        return await this.permissionGroupService.update(permissionGroup);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<PermissionGroup> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'PermissionGroup', id);
        const toDelete = await this.permissionGroupService.findById(id);
        return await this.permissionGroupService.delete(toDelete);
    }
}
