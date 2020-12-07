import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblReportCustomerCategoryDate from '../../domain/tbl-report-customer-category-date.entity';
import { TblReportCustomerCategoryDateService } from '../../service/tbl-report-customer-category-date.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-report-customer-category-dates')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-report-customer-category-dates')
export class TblReportCustomerCategoryDateController {
  logger = new Logger('TblReportCustomerCategoryDateController');

  constructor(private readonly tblReportCustomerCategoryDateService: TblReportCustomerCategoryDateService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblReportCustomerCategoryDate
  })
  async getAll(@Req() req: Request): Promise<TblReportCustomerCategoryDate[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblReportCustomerCategoryDateService.findAndCount({
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
    type: TblReportCustomerCategoryDate
  })
  async getOne(@Param('id') id: string): Promise<TblReportCustomerCategoryDate> {
    return await this.tblReportCustomerCategoryDateService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblReportCustomerCategoryDate' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblReportCustomerCategoryDate
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(
    @Req() req: Request,
    @Body() tblReportCustomerCategoryDate: TblReportCustomerCategoryDate
  ): Promise<TblReportCustomerCategoryDate> {
    const created = await this.tblReportCustomerCategoryDateService.save(tblReportCustomerCategoryDate);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblReportCustomerCategoryDate', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblReportCustomerCategoryDate' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblReportCustomerCategoryDate
  })
  async put(
    @Req() req: Request,
    @Body() tblReportCustomerCategoryDate: TblReportCustomerCategoryDate
  ): Promise<TblReportCustomerCategoryDate> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblReportCustomerCategoryDate', tblReportCustomerCategoryDate.id);
    return await this.tblReportCustomerCategoryDateService.update(tblReportCustomerCategoryDate);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblReportCustomerCategoryDate' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblReportCustomerCategoryDate> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblReportCustomerCategoryDate', id);
    const toDelete = await this.tblReportCustomerCategoryDateService.findById(id);
    return await this.tblReportCustomerCategoryDateService.delete(toDelete);
  }
}
