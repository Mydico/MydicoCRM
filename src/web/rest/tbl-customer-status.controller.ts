import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerStatus from '../../domain/tbl-customer-status.entity';
import { TblCustomerStatusService } from '../../service/tbl-customer-status.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-statuses')
export class TblCustomerStatusController {
  logger = new Logger('TblCustomerStatusController');

  constructor(private readonly tblCustomerStatusService: TblCustomerStatusService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerStatus
  })
  async getAll(@Req() req: Request): Promise<TblCustomerStatus[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerStatusService.findAndCount({
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
    type: TblCustomerStatus
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerStatus> {
    return await this.tblCustomerStatusService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerStatus' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerStatus
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerStatus: TblCustomerStatus): Promise<TblCustomerStatus> {
    const created = await this.tblCustomerStatusService.save(tblCustomerStatus);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerStatus', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerStatus' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerStatus
  })
  async put(@Req() req: Request, @Body() tblCustomerStatus: TblCustomerStatus): Promise<TblCustomerStatus> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerStatus', tblCustomerStatus.id);
    return await this.tblCustomerStatusService.update(tblCustomerStatus);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerStatus' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerStatus> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerStatus', id);
    const toDelete = await this.tblCustomerStatusService.findById(id);
    return await this.tblCustomerStatusService.delete(toDelete);
  }
}
