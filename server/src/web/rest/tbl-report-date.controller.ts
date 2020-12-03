import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblReportDate from '../../domain/tbl-report-date.entity';
import { TblReportDateService } from '../../service/tbl-report-date.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-report-dates')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-report-dates')
export class TblReportDateController {
  logger = new Logger('TblReportDateController');

  constructor(private readonly tblReportDateService: TblReportDateService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblReportDate
  })
  async getAll(@Req() req: Request): Promise<TblReportDate[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblReportDateService.findAndCount({
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
    type: TblReportDate
  })
  async getOne(@Param('id') id: string): Promise<TblReportDate> {
    return await this.tblReportDateService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblReportDate' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblReportDate
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblReportDate: TblReportDate): Promise<TblReportDate> {
    const created = await this.tblReportDateService.save(tblReportDate);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblReportDate', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblReportDate' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblReportDate
  })
  async put(@Req() req: Request, @Body() tblReportDate: TblReportDate): Promise<TblReportDate> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblReportDate', tblReportDate.id);
    return await this.tblReportDateService.update(tblReportDate);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblReportDate' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblReportDate> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblReportDate', id);
    const toDelete = await this.tblReportDateService.findById(id);
    return await this.tblReportDateService.delete(toDelete);
  }
}
