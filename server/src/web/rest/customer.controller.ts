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
  CacheInterceptor
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
    const filter = [];
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter.push({ [item]: Like(`%${req.query[item]}%`) });
      }
    });

    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    // if (filter.length === 0) {
    //   filter['department'] = In(departmentVisible);
    //   filter['dateOfBirth'] = Between(new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    // } else {
    //   filter[0]['department'] = In(departmentVisible);
    //   filter[0]['dateOfBirth'] = Between(new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    // }
    const [results, count] = await this.customerService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      false,
      null
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return null;
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
    const filter: any = [];
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
      departmentVisible.push(currentUser.department.id);
    }
    // if (filter.length === 0) {
    //   const saleFilter = { department: In(departmentVisible) };
    //   if (isEmployee.length > 0) saleFilter['sale'] = currentUser.id;
    //   filter.push(saleFilter);
    // } else {
    //   filter[0]['department'] = In(departmentVisible);
    //   // if (isEmployee.length > 0) filter[filter.length - 1]['sale'] = currentUser.id;
    // }
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
    customer.department = currentUser.department;
    customer.sale = currentUser;
    const created = await this.customerService.save(customer);
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
  async put(@Res() res: Response, @Body() customer: Customer): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'Customer', customer.id);
    return res.send(await this.customerService.update(customer));
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
