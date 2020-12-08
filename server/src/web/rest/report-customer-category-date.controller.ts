import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ReportCustomerCategoryDate from '../../domain/report-customer-category-date.entity';
import { ReportCustomerCategoryDateService } from '../../service/report-customer-category-date.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/report-customer-category-dates')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('report-customer-category-dates')
export class ReportCustomerCategoryDateController {
  logger = new Logger('ReportCustomerCategoryDateController');

  constructor(private readonly reportCustomerCategoryDateService: ReportCustomerCategoryDateService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ReportCustomerCategoryDate
  })
  async getAll(@Req() req: Request): Promise<ReportCustomerCategoryDate[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.reportCustomerCategoryDateService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ReportCustomerCategoryDate
  })
  async getOne(@Param('id') id: string): Promise<ReportCustomerCategoryDate> {
    return await this.reportCustomerCategoryDateService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create reportCustomerCategoryDate' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ReportCustomerCategoryDate
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() reportCustomerCategoryDate: ReportCustomerCategoryDate): Promise<ReportCustomerCategoryDate> {
    const created = await this.reportCustomerCategoryDateService.save(reportCustomerCategoryDate);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ReportCustomerCategoryDate', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update reportCustomerCategoryDate' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ReportCustomerCategoryDate
  })
  async put(@Req() req: Request, @Body() reportCustomerCategoryDate: ReportCustomerCategoryDate): Promise<ReportCustomerCategoryDate> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ReportCustomerCategoryDate', reportCustomerCategoryDate.id);
    return await this.reportCustomerCategoryDateService.update(reportCustomerCategoryDate);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete reportCustomerCategoryDate' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<ReportCustomerCategoryDate> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ReportCustomerCategoryDate', id);
    const toDelete = await this.reportCustomerCategoryDateService.findById(id);
    return await this.reportCustomerCategoryDateService.delete(toDelete);
  }
}
