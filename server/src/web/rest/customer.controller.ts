import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Customer from '../../domain/customer.entity';
import { CustomerService } from '../../service/customer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('customers')
export class CustomerController {
  logger = new Logger('CustomerController');

  constructor(private readonly customerService: CustomerService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Customer
  })
  async getAll(@Req() req: Request): Promise<Customer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.customerService.findAndCount({
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
    type: Customer
  })
  async getOne(@Param('id') id: string): Promise<Customer> {
    return await this.customerService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create customer' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Customer
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() customer: Customer): Promise<Customer> {
    const created = await this.customerService.save(customer);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Customer', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update customer' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Customer
  })
  async put(@Req() req: Request, @Body() customer: Customer): Promise<Customer> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Customer', customer.id);
    return await this.customerService.update(customer);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete customer' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Customer> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Customer', id);
    const toDelete = await this.customerService.findById(id);
    return await this.customerService.delete(toDelete);
  }
}
