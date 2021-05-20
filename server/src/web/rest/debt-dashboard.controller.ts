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
import DebtDashboard from '../../domain/debt-dashboard.entity';
import { DebtDashboardService } from '../../service/debt-dashboard.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Between, Equal } from 'typeorm';

@Controller('api/debt-dashboards')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class DebtDashboardController {
  logger = new Logger('DebtDashboardController');

  constructor(private readonly debtDashboardService: DebtDashboardService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DebtDashboard
  })
  async getAll(@Req() req: Request, @Res() res): Promise<DebtDashboard[]> {
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'startDate' && item !== 'endDate') {
        filter[item] = req.query[item];
      }
    });
    const where = {
      ...filter
    };
    if (req.query.startDate && req.query.endDate) {
      where['createdDate'] = Between(req.query.startDate, req.query.endDate);
    }
    const [results, count] = await this.debtDashboardService.findAndCount({
      where
    });
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: DebtDashboard
  })
  async getOne(@Param('id') id: string): Promise<DebtDashboard> {
    return await this.debtDashboardService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DebtDashboard
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() debtDashboard: DebtDashboard): Promise<DebtDashboard> {
    const created = await this.debtDashboardService.save(debtDashboard);
    HeaderUtil.addEntityCreatedHeaders(res, 'DebtDashboard', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DebtDashboard
  })
  async put(@Res() res: Response, @Body() debtDashboard: DebtDashboard): Promise<DebtDashboard> {
    HeaderUtil.addEntityCreatedHeaders(res, 'DebtDashboard', debtDashboard.id);
    return await this.debtDashboardService.update(debtDashboard);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<DebtDashboard> {
    HeaderUtil.addEntityDeletedHeaders(res, 'DebtDashboard', id);
    const toDelete = await this.debtDashboardService.findById(id);
    return await this.debtDashboardService.delete(toDelete);
  }
}
