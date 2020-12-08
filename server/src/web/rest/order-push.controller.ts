import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import OrderPush from '../../domain/order-push.entity';
import { OrderPushService } from '../../service/order-push.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/order-pushes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('order-pushes')
export class OrderPushController {
  logger = new Logger('OrderPushController');

  constructor(private readonly orderPushService: OrderPushService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: OrderPush
  })
  async getAll(@Req() req: Request): Promise<OrderPush[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.orderPushService.findAndCount({
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
    type: OrderPush
  })
  async getOne(@Param('id') id: string): Promise<OrderPush> {
    return await this.orderPushService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create orderPush' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: OrderPush
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() orderPush: OrderPush): Promise<OrderPush> {
    const created = await this.orderPushService.save(orderPush);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'OrderPush', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update orderPush' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: OrderPush
  })
  async put(@Req() req: Request, @Body() orderPush: OrderPush): Promise<OrderPush> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'OrderPush', orderPush.id);
    return await this.orderPushService.update(orderPush);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete orderPush' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<OrderPush> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'OrderPush', id);
    const toDelete = await this.orderPushService.findById(id);
    return await this.orderPushService.delete(toDelete);
  }
}
