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
  HttpStatus,
  CacheInterceptor
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ReportService } from '../../service/report.service';
import { OrderService } from '../../service/order.service';

@Controller('api/reports')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
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

  @Get('/best-product-sale')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getBest10ProductSale(@Req() req: Request, @Res() res): Promise<any> {
    if (req.query['saleId']) {
      return res.send(await this.reportService.getTop10BestSaleProduct(req.query['saleId']));
    } else {
      throw new HttpException('Không thể xử lý dữ liệu', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Get('/best-customer')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getBest10Customer(@Req() req: Request, @Res() res): Promise<any> {
    if (req.query['saleId']) {
      return res.send(await this.reportService.getTop10BestCustomer(req.query['saleId']));
    } else {
      throw new HttpException('Không thể xử lý dữ liệu', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
