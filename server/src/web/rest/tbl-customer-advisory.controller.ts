import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerAdvisory from '../../domain/tbl-customer-advisory.entity';
import { TblCustomerAdvisoryService } from '../../service/tbl-customer-advisory.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-advisories')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-advisories')
export class TblCustomerAdvisoryController {
  logger = new Logger('TblCustomerAdvisoryController');

  constructor(private readonly tblCustomerAdvisoryService: TblCustomerAdvisoryService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerAdvisory
  })
  async getAll(@Req() req: Request): Promise<TblCustomerAdvisory[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerAdvisoryService.findAndCount({
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
    type: TblCustomerAdvisory
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerAdvisory> {
    return await this.tblCustomerAdvisoryService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerAdvisory' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerAdvisory
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerAdvisory: TblCustomerAdvisory): Promise<TblCustomerAdvisory> {
    const created = await this.tblCustomerAdvisoryService.save(tblCustomerAdvisory);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerAdvisory', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerAdvisory' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerAdvisory
  })
  async put(@Req() req: Request, @Body() tblCustomerAdvisory: TblCustomerAdvisory): Promise<TblCustomerAdvisory> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerAdvisory', tblCustomerAdvisory.id);
    return await this.tblCustomerAdvisoryService.update(tblCustomerAdvisory);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerAdvisory' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerAdvisory> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerAdvisory', id);
    const toDelete = await this.tblCustomerAdvisoryService.findById(id);
    return await this.tblCustomerAdvisoryService.delete(toDelete);
  }
}
