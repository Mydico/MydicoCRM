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
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { In, Like, Not } from 'typeorm';
import { OrderStatus } from '../../domain/enumeration/order-status';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';

@Controller('api/orders')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class OrderController {
  logger = new Logger('OrderController');

  constructor(private readonly orderService: OrderService, private readonly departmentService: DepartmentService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Order
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Order[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'department' && item !== 'dependency' && item !== 'status') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];

    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const [results, count] = await this.orderService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
        where: filter
      },
      filter,
      departmentVisible,
      isEmployee,
      currentUser
    );
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
    order.sale = currentUser;
    order.department = currentUser.department;
    order.customerName = order.customer.name;
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const created = await this.orderService.save(order, departmentVisible, isEmployee, currentUser);
    HeaderUtil.addEntityCreatedHeaders(res, 'Order', created.id);
    return res.send(created);
  }

  @Put('/approve')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async approve(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
  }

  @Put('/cancel')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async cancel(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
  }

  @Put('/delete')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async delete(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
  }

  @Put('/create-cod')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async createCOD(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    if (order.status === OrderStatus.CREATE_COD) {
      const canExport = await this.orderService.canExportStore(order);
      if (!canExport) {
        throw new HttpException('Sản phẩm trong kho không đủ để tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
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
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    if (order.status === OrderStatus.CREATE_COD) {
      const canExport = await this.orderService.canExportStore(order);
      if (!canExport) {
        throw new HttpException('Sản phẩm trong kho không đủ để tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
  }

  @Put('/self-edit')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async selfEdit(@Req() req: Request, @Res() res: Response, @Body() order: Order): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'Order', order.id);
    const currentUser = req.user as User;
    order.lastModifiedBy = currentUser.login;
    const isAdmin = currentUser.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
    if (!isAdmin && currentUser.login !== order.createdBy) {
      throw new HttpException('Bạn không thể thực hiện thao tác này', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
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
    let departmentVisible = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    return res.send(await this.orderService.update(order, departmentVisible, isEmployee, currentUser));
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
