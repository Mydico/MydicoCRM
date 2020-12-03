import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblOrder from '../../domain/tbl-order.entity';
import { TblOrderService } from '../../service/tbl-order.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-orders')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-orders')
export class TblOrderController {
  logger = new Logger('TblOrderController');

  constructor(private readonly tblOrderService: TblOrderService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblOrder
  })
  async getAll(@Req() req: Request): Promise<TblOrder[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblOrderService.findAndCount({
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
    type: TblOrder
  })
  async getOne(@Param('id') id: string): Promise<TblOrder> {
    return await this.tblOrderService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblOrder' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblOrder
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblOrder: TblOrder): Promise<TblOrder> {
    const created = await this.tblOrderService.save(tblOrder);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblOrder', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblOrder' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblOrder
  })
  async put(@Req() req: Request, @Body() tblOrder: TblOrder): Promise<TblOrder> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblOrder', tblOrder.id);
    return await this.tblOrderService.update(tblOrder);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblOrder' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblOrder> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblOrder', id);
    const toDelete = await this.tblOrderService.findById(id);
    return await this.tblOrderService.delete(toDelete);
  }
}
