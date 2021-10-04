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
import DebtDashboard from '../../domain/debt-dashboard.entity';
import { DebtDashboardService } from '../../service/debt-dashboard.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Between, Equal, In, LessThan } from 'typeorm';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';
import { memoizedTransformData, memoizedSumData, memoizedSumDebtData } from '../../utils/helper/permission-normalization';

@Controller('api/debt-dashboards')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class DebtDashboardController {
  logger = new Logger('DebtDashboardController');

  constructor(private readonly debtDashboardService: DebtDashboardService, private readonly departmentService: DepartmentService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DebtDashboard
  })
  async getAll(@Req() req: Request, @Res() res): Promise<DebtDashboard[]> {
    const filter = {};
    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    Object.keys(req.query).forEach(item => {
      if (item !== 'startDate' && item !== 'endDate') {
        filter[item] = req.query[item];
      }
    });
    const where = {
      ...filter
    };
    if (!isEmployee) {
      let departmentVisible: any = [];

      if (currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
      } else {
        departmentVisible.push(req.query['departmentId']);
      }
      where['departmentId'] = In(departmentVisible);
      delete where['userId'];
    }

    if (req.query.startDate && req.query.endDate) {
      where['createdDate'] = LessThan(req.query.endDate);
    }
    const results = await this.debtDashboardService.findAndCount({
      where,
      cache: 3 * 3600
    });
    const sum = memoizedTransformData(results).reduce((curr, prev) => {
      let sum = 0;
      if (prev.type === 'ORDER') {
        sum = +Number(prev.amount);
      } else if (prev.type === 'RETURN') {
        sum = -Number(prev.amount);
      } else {
        sum = 0;
      }
      return (curr[`${prev.createdDate}`] = (Number(curr[`${prev.createdDate}`]) || 0) + Number(sum)), curr;
    }, {});
    return res.send(sum);
  }

  @Get('/sum')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DebtDashboard
  })
  async getSum(@Req() req: Request, @Res() res): Promise<DebtDashboard[]> {
    const filter = {};
    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    Object.keys(req.query).forEach(item => {
      if (item !== 'startDate' && item !== 'endDate') {
        filter[item] = req.query[item];
      }
    });
    const where = {
      ...filter
    };
    if (!isEmployee) {
      let departmentVisible: any = [];

      if (currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
      } else {
        departmentVisible.push(req.query['departmentId']);
      }
      where['departmentId'] = In(departmentVisible);
      const isBranchManager = currentUser.roles.filter(item => item.authority === RoleType.BRANCH_MANAGER).length > 0;
      if(isBranchManager){
        where['branchId'] = currentUser.branch.id
      }
      delete where['saleId'];
    }

    if (req.query.startDate && req.query.endDate) {
      where['createdDate'] = LessThan(req.query.endDate);
    }
    const results = await this.debtDashboardService.findAndCount({
      where,
      cache: 3 * 3600
    });
    const sum = memoizedSumDebtData(results);
    return res.send({ sum });
  }
}
