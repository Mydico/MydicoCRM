import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomer from '../../domain/tbl-customer.entity';
import { TblCustomerService } from '../../service/tbl-customer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customers')
export class TblCustomerController {
  logger = new Logger('TblCustomerController');

  constructor(private readonly tblCustomerService: TblCustomerService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomer
  })
  async getAll(@Req() req: Request): Promise<TblCustomer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerService.findAndCount({
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
    type: TblCustomer
  })
  async getOne(@Param('id') id: string): Promise<TblCustomer> {
    return await this.tblCustomerService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomer' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomer
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomer: TblCustomer): Promise<TblCustomer> {
    const created = await this.tblCustomerService.save(tblCustomer);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomer', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomer' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomer
  })
  async put(@Req() req: Request, @Body() tblCustomer: TblCustomer): Promise<TblCustomer> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomer', tblCustomer.id);
    return await this.tblCustomerService.update(tblCustomer);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomer' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomer> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomer', id);
    const toDelete = await this.tblCustomerService.findById(id);
    return await this.tblCustomerService.delete(toDelete);
  }
}
