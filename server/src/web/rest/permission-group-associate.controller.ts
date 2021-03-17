import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PermissionGroupAssociate from '../../domain/permission-group-associate.entity';
import { PermissionGroupAssociateService } from '../../service/permission-group-associate.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/permission-group-associates')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('permission-group-associates')
export class PermissionGroupAssociateController {
  logger = new Logger('PermissionGroupAssociateController');

  constructor(private readonly permissionGroupAssociateService: PermissionGroupAssociateService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PermissionGroupAssociate
  })
  async getAll(@Req() req: Request): Promise<PermissionGroupAssociate[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.permissionGroupAssociateService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: PermissionGroupAssociate
  })
  async getOne(@Param('id') id: string): Promise<PermissionGroupAssociate> {
    return await this.permissionGroupAssociateService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create permissionGroupAssociate' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PermissionGroupAssociate
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate> {
    const created = await this.permissionGroupAssociateService.save(permissionGroupAssociate);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionGroupAssociate', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update permissionGroupAssociate' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PermissionGroupAssociate
  })
  async put(@Req() req: Request, @Body() permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PermissionGroupAssociate', permissionGroupAssociate.id);
    return await this.permissionGroupAssociateService.update(permissionGroupAssociate);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete permissionGroupAssociate' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<PermissionGroupAssociate> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'PermissionGroupAssociate', id);
    const toDelete = await this.permissionGroupAssociateService.findById(id);
    return await this.permissionGroupAssociateService.delete(toDelete);
  }
}
