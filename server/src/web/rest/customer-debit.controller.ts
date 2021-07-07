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
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerDebit from '../../domain/customer-debit.entity';
import { CustomerDebitService } from '../../service/customer-debit.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm/find-options/operator/Like';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';
import { In } from 'typeorm';

@Controller('api/customer-debits')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class CustomerDebitController {
  logger = new Logger('CustomerDebitController');

  constructor(private readonly customerDebitService: CustomerDebitService, private readonly departmentService: DepartmentService) {}

  @Get('/total-debit')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: CustomerDebit
  })
  async getTotalDebit(@Req() req: Request, @Res() res): Promise<CustomerDebit[]> {
    const filter = {};
    Object.keys(req.query).forEach(item => {
      filter[item] = req.query[item];
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    const allowToSeeAll = currentUser.roles.filter(item => item.allowViewAll).length > 0;

    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const result = await this.customerDebitService.countDebit(filter, departmentVisible, isEmployee, allowToSeeAll, currentUser);
    return res.send(result);
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: CustomerDebit
  })
  async getAll(@Req() req: Request, @Res() res): Promise<CustomerDebit[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = [];
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    const allowViewAll = currentUser.roles.filter(item => item.allowViewAll).length > 0;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const [results, count] = await this.customerDebitService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
        where: filter
      },
      filter,
      departmentVisible,
      isEmployee,
      allowViewAll,
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
    type: CustomerDebit
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<CustomerDebit> {
    return res.send(await this.customerDebitService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CustomerDebit
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() customerDebit: CustomerDebit): Promise<Response> {
    const created = await this.customerDebitService.save(customerDebit);
    HeaderUtil.addEntityCreatedHeaders(res, 'CustomerDebit', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CustomerDebit
  })
  async put(@Res() res: Response, @Body() customerDebit: CustomerDebit): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'CustomerDebit', customerDebit.id);
    return res.send(await this.customerDebitService.update(customerDebit));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    HeaderUtil.addEntityDeletedHeaders(res, 'CustomerDebit', id);
    const toDelete = await this.customerDebitService.findById(id);
    return res.send(await this.customerDebitService.delete(toDelete));
  }
}
