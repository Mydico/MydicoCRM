import {
  Controller,
  Get,
  Logger,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { PageRequest } from '../../domain/base/pagination.entity';
import { User } from '../../domain/user.entity';
import { AuthGuard, PermissionGuard, RoleType, RolesGuard } from '../../security';
import { DepartmentService } from '../../service/department.service';
import { ReportService } from '../../service/report.service';
import { UserAnswerService } from '../../service/user-answer.service';

@Controller('api/privates')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class PrivateController {
  logger = new Logger('ReportController');

  constructor(private readonly departmentService: DepartmentService, private readonly reportService: ReportService, private readonly userAnswerService: UserAnswerService) {}


  @Get('/warehouse-private')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async warehouseReport(@Req() req: Request, @Res() res): Promise<any> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const options = {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    };
    delete req.query['page'];
    delete req.query['size'];
    delete req.query['sort'];
    const filter = await this.buildFilterForReport(req);
    // if(!req.query['department']){
    //   delete filter.department
    // }
    // console.log(filter)
    // // if(req.query['department']){
    // //   filter.department = JSON.parse(req.query['department'])

    // // }
    return res.send(await this.reportService.getWarehouseReport(options, filter));
  }

  @Get('/warehouse-private-enhance')
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async warehouseReportEnhance(@Req() req: Request, @Res() res): Promise<any> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const options = {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    };
    delete req.query['page'];
    delete req.query['size'];
    delete req.query['sort'];
    const filter = await this.buildFilterForReport(req);
    // console.log(filter)
    // // if(req.query['department']){
    // //   filter.department = JSON.parse(req.query['department'])

    // // }
    // return res.send(await this.reportService.getProductInWarehouse(options, filter));
  }


  async buildFilter(req): Promise<any> {
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item === 'saleId') {
        filter['sale'] = req.query['saleId'];
      } else {
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
      filter['department'] = departmentVisible;
      const isBranchManager = currentUser.roles.filter(item => item.authority === RoleType.BRANCH_MANAGER).length > 0;
      if (isBranchManager) {
        filter['branch'] = currentUser.branch.id;
      }
      delete filter['sale'];
    }
    return filter;
  }

  async buildFilterForReport(req): Promise<any> {
    const filter = {};
    let departmentVisible: any = [];
    const currentUser = req.user as User;
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    const isBranchManager = currentUser.roles.filter(item => item.authority === RoleType.BRANCH_MANAGER).length > 0;
    if (!isBranchManager) {
      if (!req.query['department'] && currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
      } else {
       
        if(req.query['department'] && Array.isArray(JSON.parse(req.query['department']))){
          departmentVisible = departmentVisible.concat(JSON.parse(req.query['department']));
        }else {
          req.query['department'] && departmentVisible.push(JSON.parse(req.query['department']));
        }
       
      }
    } else {
      if(JSON.parse(currentUser.department.externalChild).length > 0){
        if(req.query['department'] && Array.isArray(JSON.parse(req.query['department']))){
          departmentVisible = departmentVisible.concat(JSON.parse(req.query['department']));
        }else {
          req.query['department'] && departmentVisible.push(JSON.parse(req.query['department']));
        }
      }else {
        departmentVisible.push(currentUser.department.id);
      }
    }
    if (JSON.parse(currentUser.department.externalChild).length > 0 && !req.query['department']) {
      departmentVisible.push(JSON.parse(currentUser.department.externalChild)[0]);
    }

    delete req.query['department'];
    Object.keys(req.query).forEach(async key => {
      filter[key] = req.query[key];
    });
    filter['department'] = departmentVisible.map(item => Number(item));
    if (isBranchManager) {
      filter['branch'] = currentUser.branch.id;
    }
    if(JSON.parse(currentUser.department.externalChild).length > 0){
      if(!filter['department'].includes(JSON.parse(currentUser.department.externalChild)[0])){
        delete filter['branch']
      }
      
    }
    if (isEmployee) {
      filter['sale'] = currentUser.id;
    }
    return filter;
  }
}
