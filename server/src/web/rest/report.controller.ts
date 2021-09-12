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
import { User } from '../../domain/user.entity';
import { In } from 'typeorm';
import { DepartmentService } from '../../service/department.service';
import { PageRequest } from '../../domain/base/pagination.entity';

@Controller('api/reports')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class ReportController {
  logger = new Logger('ReportController');

  constructor(private readonly departmentService: DepartmentService, private readonly reportService: ReportService) {}

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
    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;

    if (!isEmployee) {
      let departmentVisible: any = [];

      if (currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
      } else {
        departmentVisible.push(req.query['departmentId']);
      }
      return res.send(await this.reportService.getOrderSaleReportForManager(departmentVisible, filter));
    } else {
      return res.send(await this.reportService.getOrderSaleReport(req.query['userId'], filter));
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

  @Get('/order')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getOrder(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getOrderReport(filter));
  }

  @Get('/new-customer')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getNewCustomer(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getNewCustomerReport(filter));
  }

  @Get('/debt')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getDebt(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getDebt(filter));
  }

  @Get('/income')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getIncome(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getIncome(filter));
  }

  @Get('/department')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getDepartment(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getSaleReportByDepartment(filter));
  }

  @Get('/top10sale')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getTop10sale(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getTop10Sale(filter));
  }

  @Get('/top10product')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getTop10product(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getTop10Product(filter));
  }

  @Get('/top10customer')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getTop10customer(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getTop10Customer(filter));
  }

  @Get('/count-total-product')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async countTotalProduct(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getSumProductQuantity(filter));
  }

  @Get('/count-total-price-product')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async countTotalPriceProduct(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getSumIncomeForProductReport(filter));
  }

  @Get('/product-report')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getProductReport(@Req() req: Request, @Res() res): Promise<any> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const options = {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    };
    delete req.query['page'];
    delete req.query['size'];
    delete req.query['sort'];
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getProductReport(options, filter));
  }

  @Get('/user-report')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getSaleReport(@Req() req: Request, @Res() res): Promise<any> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const options = {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    };
    delete req.query['page'];
    delete req.query['size'];
    delete req.query['sort'];
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getSaleReport(options, filter));
  }

  @Get('/sale-summary-report')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getSummarySaleReport(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getSaleSummary(filter));
  }

  @Get('/customer-report')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getCustomerReport(@Req() req: Request, @Res() res): Promise<any> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const options = {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    };
    delete req.query['page'];
    delete req.query['size'];
    delete req.query['sort'];
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getCustomerReport(options, filter));
  }

  @Get('/customer-summary-report')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getSummaryCustomerReport(@Req() req: Request, @Res() res): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    if (!req.query['department'] && currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    } else {
      departmentVisible.push(req.query['department']);
    }
    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible;
    return res.send(await this.reportService.getCustomerSummary(filter));
  }
}
