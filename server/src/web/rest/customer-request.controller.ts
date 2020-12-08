import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import CustomerRequest from '../../domain/customer-request.entity';
import { CustomerRequestService } from '../../service/customer-request.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-requests')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('customer-requests')
export class CustomerRequestController {
  logger = new Logger('CustomerRequestController');

  constructor(private readonly customerRequestService: CustomerRequestService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: CustomerRequest
  })
  async getAll(@Req() req: Request): Promise<CustomerRequest[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.customerRequestService.findAndCount({
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
    type: CustomerRequest
  })
  async getOne(@Param('id') id: string): Promise<CustomerRequest> {
    return await this.customerRequestService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create customerRequest' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CustomerRequest
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() customerRequest: CustomerRequest): Promise<CustomerRequest> {
    const created = await this.customerRequestService.save(customerRequest);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerRequest', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update customerRequest' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CustomerRequest
  })
  async put(@Req() req: Request, @Body() customerRequest: CustomerRequest): Promise<CustomerRequest> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerRequest', customerRequest.id);
    return await this.customerRequestService.update(customerRequest);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete customerRequest' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<CustomerRequest> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'CustomerRequest', id);
    const toDelete = await this.customerRequestService.findById(id);
    return await this.customerRequestService.delete(toDelete);
  }
}
