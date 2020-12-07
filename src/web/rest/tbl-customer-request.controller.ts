import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerRequest from '../../domain/tbl-customer-request.entity';
import { TblCustomerRequestService } from '../../service/tbl-customer-request.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-requests')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-requests')
export class TblCustomerRequestController {
  logger = new Logger('TblCustomerRequestController');

  constructor(private readonly tblCustomerRequestService: TblCustomerRequestService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerRequest
  })
  async getAll(@Req() req: Request): Promise<TblCustomerRequest[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerRequestService.findAndCount({
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
    type: TblCustomerRequest
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerRequest> {
    return await this.tblCustomerRequestService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerRequest' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerRequest
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerRequest: TblCustomerRequest): Promise<TblCustomerRequest> {
    const created = await this.tblCustomerRequestService.save(tblCustomerRequest);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerRequest', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerRequest' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerRequest
  })
  async put(@Req() req: Request, @Body() tblCustomerRequest: TblCustomerRequest): Promise<TblCustomerRequest> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerRequest', tblCustomerRequest.id);
    return await this.tblCustomerRequestService.update(tblCustomerRequest);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerRequest' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerRequest> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerRequest', id);
    const toDelete = await this.tblCustomerRequestService.findById(id);
    return await this.tblCustomerRequestService.delete(toDelete);
  }
}
