import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblUser from '../../domain/tbl-user.entity';
import { TblUserService } from '../../service/tbl-user.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-users')
export class TblUserController {
  logger = new Logger('TblUserController');

  constructor(private readonly tblUserService: TblUserService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblUser
  })
  async getAll(@Req() req: Request): Promise<TblUser[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblUserService.findAndCount({
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
    type: TblUser
  })
  async getOne(@Param('id') id: string): Promise<TblUser> {
    return await this.tblUserService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblUser' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblUser
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblUser: TblUser): Promise<TblUser> {
    const created = await this.tblUserService.save(tblUser);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUser', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblUser' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblUser
  })
  async put(@Req() req: Request, @Body() tblUser: TblUser): Promise<TblUser> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUser', tblUser.id);
    return await this.tblUserService.update(tblUser);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblUser' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblUser> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblUser', id);
    const toDelete = await this.tblUserService.findById(id);
    return await this.tblUserService.delete(toDelete);
  }
}
