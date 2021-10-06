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
import IncomeDashboard from '../../domain/income-dashboard.entity';
import { IncomeDashboardService } from '../../service/income-dashboard.service';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Between, Equal, In } from 'typeorm';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';
import { memoizedSumData, memoizedTransformData } from '../../utils/helper/permission-normalization';

@Controller('api/income-dashboards')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class IncomeDashboardController {
  logger = new Logger('IncomeDashboardController');

  constructor(private readonly incomeDashboardService: IncomeDashboardService, private readonly departmentService: DepartmentService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: IncomeDashboard
  })
  async getAll(@Req() req: Request, @Res() res): Promise<IncomeDashboard[]> {
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
      where['createdDate'] = Between(req.query.startDate, req.query.endDate);
    }
    const results = await this.incomeDashboardService.findAndCount({
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
    type: IncomeDashboard
  })
  async getSum(@Req() req: Request, @Res() res): Promise<IncomeDashboard[]> {
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
      where['createdDate'] = Between(req.query.startDate, `${req.query.endDate} 23:59:59`);
    }
    const results = await this.incomeDashboardService.findAndCount({
      where,
      cache: 3 * 3600
    });
    const sum = memoizedSumData(results);
    return res.send({ sum });
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: IncomeDashboard
  })
  async getOne(@Param('id') id: string): Promise<IncomeDashboard> {
    return await this.incomeDashboardService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: IncomeDashboard
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() incomeDashboard: IncomeDashboard): Promise<IncomeDashboard> {
    const created = await this.incomeDashboardService.save(incomeDashboard);
    HeaderUtil.addEntityCreatedHeaders(res, 'IncomeDashboard', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: IncomeDashboard
  })
  async put(@Res() res: Response, @Body() incomeDashboard: IncomeDashboard): Promise<IncomeDashboard> {
    HeaderUtil.addEntityCreatedHeaders(res, 'IncomeDashboard', incomeDashboard.id);
    return await this.incomeDashboardService.update(incomeDashboard);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<IncomeDashboard> {
    HeaderUtil.addEntityDeletedHeaders(res, 'IncomeDashboard', id);
    const toDelete = await this.incomeDashboardService.findById(id);
    return await this.incomeDashboardService.delete(toDelete);
  }
}
