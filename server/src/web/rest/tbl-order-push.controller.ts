import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblOrderPush from '../../domain/tbl-order-push.entity';
import { TblOrderPushService } from '../../service/tbl-order-push.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-order-pushes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-order-pushes')
export class TblOrderPushController {
  logger = new Logger('TblOrderPushController');

  constructor(private readonly tblOrderPushService: TblOrderPushService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblOrderPush
  })
  async getAll(@Req() req: Request): Promise<TblOrderPush[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblOrderPushService.findAndCount({
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
    type: TblOrderPush
  })
  async getOne(@Param('id') id: string): Promise<TblOrderPush> {
    return await this.tblOrderPushService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblOrderPush' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblOrderPush
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblOrderPush: TblOrderPush): Promise<TblOrderPush> {
    const created = await this.tblOrderPushService.save(tblOrderPush);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblOrderPush', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblOrderPush' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblOrderPush
  })
  async put(@Req() req: Request, @Body() tblOrderPush: TblOrderPush): Promise<TblOrderPush> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblOrderPush', tblOrderPush.id);
    return await this.tblOrderPushService.update(tblOrderPush);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblOrderPush' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblOrderPush> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblOrderPush', id);
    const toDelete = await this.tblOrderPushService.findById(id);
    return await this.tblOrderPushService.delete(toDelete);
  }
}
