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
  Res,
  CacheInterceptor,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Customer from '../../domain/customer.entity';
import { CustomerService } from '../../service/customer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Between, In, Like } from 'typeorm';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';

@Controller('api/customers')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class CustomerController {
  logger = new Logger('CustomerController');

  constructor(private readonly customerService: CustomerService, private readonly departmentService: DepartmentService) {}

  @Get('/birthday')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Customer
  })
  async getBirthdayAll(@Req() req: Request, @Res() res): Promise<Customer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    filter['findBirthday'] = true;
    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    const [results, count] = await this.customerService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      isEmployee,
      currentUser
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/find')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Customer
  })
  async find(@Req() req: Request, @Res() res): Promise<Customer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter: any = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'department' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible: any = [];

    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const [results, count] = await this.customerService.filter(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      isEmployee,
      currentUser
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/find/exact')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Customer
  })
  async findExact(@Req() req: Request, @Res() res): Promise<Customer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter: any = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });

    const [results, count] = await this.customerService.filterExact(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Customer
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Customer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter: any = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'department' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible: any = [];

    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const [results, count] = await this.customerService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
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
    type: Customer
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Customer> {
    return res.send(await this.customerService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Customer
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() customer: Customer): Promise<Response> {
    const currentUser = req.user as User;
    if (!currentUser.branch) {
      throw new HttpException('Bạn không có phòng ban. Hãy liên hệ quản trị hệ thống để cài đặt', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    customer.branch = currentUser.branch;
    customer.sale = currentUser;
    customer.saleName = currentUser.login;
    let departmentVisible: any = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const created = await this.customerService.save(customer, departmentVisible, isEmployee, currentUser);
    HeaderUtil.addEntityCreatedHeaders(res, 'Customer', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Customer
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() customer: Customer): Promise<Response> {
    const currentUser = req.user as User;
    let departmentVisible: any = [];
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    HeaderUtil.addEntityUpdatedHeaders(res, 'Customer', customer.id);
    return res.send(await this.customerService.update(customer, departmentVisible, isEmployee, currentUser));
  }

  @Put('/many')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Customer
  })
  async putMany(@Req() req: Request, @Res() res: Response, @Body() customers: Customer[]): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'Customer', null);
    return res.send(await this.customerService.saveMany(customers));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Customer> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Customer', id);
    const toDelete = await this.customerService.findById(id);
    return await this.customerService.delete(toDelete);
  }
}
