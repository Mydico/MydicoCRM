import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ReportService } from '../../service/report.service';
import { BranchService } from '../../service/branch.service';
import { ChangePasswordDTO } from '../../service/dto/user.dto';
import { DepartmentService } from '../../service/department.service';
import { OrderService } from '../../service/order.service';

@Controller('api/reports')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class ReportController {
  logger = new Logger('ReportController');

  constructor(private readonly orderService: OrderService, private readonly reportService: ReportService) {}

  @Get('/sale-report')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getOrderReport(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'userId') {
        filter[item] = req.query[item];
      }
    });
    if (req.query['userId']) {
      return res.send(await this.reportService.getOrderSaleReport(req.query['userId'], filter));
    } else {
      throw new HttpException('Không thể xử lý dữ liệu', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
