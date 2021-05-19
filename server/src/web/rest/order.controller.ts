import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Order from '../../domain/order.entity';
import { OrderService } from '../../service/order.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like, Not } from 'typeorm';
import { OrderStatus } from '../../domain/enumeration/order-status';
import { User } from '../../domain/user.entity';

@Controller('api/orders')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class OrderController {
  logger = new Logger('OrderController');

  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Order
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Order[]> {
    const currentUser = req.user as User;
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.orderService.findAndCount(pageRequest, req, currentUser);
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Order
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Order> {
    return res.send(await this.orderService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Order
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    const currentUser = req.user as User;
    order.createdBy = currentUser.login;
    order.department = currentUser.department;
    const created = await this.orderService.save(order);
    HeaderUtil.addEntityCreatedHeaders(res, 'Order', created.id);
    return res.send(created);
  }

  @Put('/status')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async putStatus(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    if (order.status === OrderStatus.CREATE_COD) {
      const canExport = await this.orderService.canExportStore(order);
      if (!canExport) {
        throw new HttpException('Sản phẩm trong kho không đủ để tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    return res.send(await this.orderService.update(order));
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    // const canExport = await this.orderService.canExportStore(order);
    // if (!canExport) {
    //   throw new HttpException('Sản phẩm trong kho không đủ để tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
    // }
    return res.send(await this.orderService.update(order));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Order', id);
    const toDelete = await this.orderService.findById(id);
    return res.send(await this.orderService.delete(toDelete));
  }
}
