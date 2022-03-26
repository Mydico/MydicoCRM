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
  HttpException,
  HttpStatus,
  CacheInterceptor
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Transaction from '../../domain/transaction.entity';
import { TransactionService } from '../../service/transaction.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Equal, FindOneOptions, Like } from 'typeorm';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';

@Controller('api/transactions')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class TransactionController {
  logger = new Logger('TransactionController');

  constructor(private readonly transactionService: TransactionService, private readonly departmentService: DepartmentService) {}

  @Get('/total-debit')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Transaction
  })
  async getTotalDebit(@Req() req: Request, @Res() res): Promise<Transaction[]> {
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
    const result = await this.transactionService.countDebit(filter, departmentVisible, isEmployee, allowToSeeAll, currentUser);
    return res.send(result);
  }

  @Get('/debt/:customerId')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Transaction
  })
  async getField(@Param('customerId') id: string, @Res() res): Promise<Response> {
    if (id) {
      return res.send(await this.transactionService.getDebForOneCustomer(id));
    } else {
      throw new HttpException('Không thực hiện được thao tác này', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Get('/find')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Transaction
  })
  async getAllDetail(@Req() req: Request, @Res() res): Promise<Transaction[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = `${req.query[item]}`;
      }
    });
    const [results, count] = await this.transactionService.findAndCountDetail(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
        where: {
          ...filter
        }
      },
      filter
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Transaction
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Transaction[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = `${req.query[item]}`;
      }
    });
    const currentUser = req.user as User;
    const allowViewAll = currentUser.roles.filter(item => item.allowViewAll).length > 0;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    let departmentVisible = [];
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const [results, count] = await this.transactionService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
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
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Transaction
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.transactionService.findById(id));
  }

  @PostMethod('/')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Transaction
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() transaction: Transaction): Promise<Response> {
    const created = await this.transactionService.save(transaction);
    HeaderUtil.addEntityCreatedHeaders(res, 'Transaction', created.id);
    return res.send(created);
  }

  @Put('/')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Transaction
  })
  async put(@Res() res: Response, @Body() transaction: Transaction): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Transaction', transaction.id);
    return res.send(await this.transactionService.update(transaction));
  }

  @Delete('/:id')
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Transaction> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Transaction', id);
    const toDelete = await this.transactionService.findById(id);
    return await this.transactionService.delete(toDelete);
  }
}
