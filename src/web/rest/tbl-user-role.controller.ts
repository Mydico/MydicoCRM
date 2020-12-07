import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblUserRole from '../../domain/tbl-user-role.entity';
import { TblUserRoleService } from '../../service/tbl-user-role.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-user-roles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-user-roles')
export class TblUserRoleController {
  logger = new Logger('TblUserRoleController');

  constructor(private readonly tblUserRoleService: TblUserRoleService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblUserRole
  })
  async getAll(@Req() req: Request): Promise<TblUserRole[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblUserRoleService.findAndCount({
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
    type: TblUserRole
  })
  async getOne(@Param('id') id: string): Promise<TblUserRole> {
    return await this.tblUserRoleService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblUserRole' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblUserRole
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblUserRole: TblUserRole): Promise<TblUserRole> {
    const created = await this.tblUserRoleService.save(tblUserRole);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserRole', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblUserRole' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblUserRole
  })
  async put(@Req() req: Request, @Body() tblUserRole: TblUserRole): Promise<TblUserRole> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserRole', tblUserRole.id);
    return await this.tblUserRoleService.update(tblUserRole);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblUserRole' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblUserRole> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblUserRole', id);
    const toDelete = await this.tblUserRoleService.findById(id);
    return await this.tblUserRoleService.delete(toDelete);
  }
}
