import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblUserNotify from '../../domain/tbl-user-notify.entity';
import { TblUserNotifyService } from '../../service/tbl-user-notify.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-user-notifies')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-user-notifies')
export class TblUserNotifyController {
  logger = new Logger('TblUserNotifyController');

  constructor(private readonly tblUserNotifyService: TblUserNotifyService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblUserNotify
  })
  async getAll(@Req() req: Request): Promise<TblUserNotify[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblUserNotifyService.findAndCount({
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
    type: TblUserNotify
  })
  async getOne(@Param('id') id: string): Promise<TblUserNotify> {
    return await this.tblUserNotifyService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblUserNotify' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblUserNotify
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblUserNotify: TblUserNotify): Promise<TblUserNotify> {
    const created = await this.tblUserNotifyService.save(tblUserNotify);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserNotify', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblUserNotify' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblUserNotify
  })
  async put(@Req() req: Request, @Body() tblUserNotify: TblUserNotify): Promise<TblUserNotify> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserNotify', tblUserNotify.id);
    return await this.tblUserNotifyService.update(tblUserNotify);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblUserNotify' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblUserNotify> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblUserNotify', id);
    const toDelete = await this.tblUserNotifyService.findById(id);
    return await this.tblUserNotifyService.delete(toDelete);
  }
}
