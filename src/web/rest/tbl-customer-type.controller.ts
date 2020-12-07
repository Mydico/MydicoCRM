import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerType from '../../domain/tbl-customer-type.entity';
import { TblCustomerTypeService } from '../../service/tbl-customer-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-types')
export class TblCustomerTypeController {
  logger = new Logger('TblCustomerTypeController');

  constructor(private readonly tblCustomerTypeService: TblCustomerTypeService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerType
  })
  async getAll(@Req() req: Request): Promise<TblCustomerType[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerTypeService.findAndCount({
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
    type: TblCustomerType
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerType> {
    return await this.tblCustomerTypeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerType' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerType
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerType: TblCustomerType): Promise<TblCustomerType> {
    const created = await this.tblCustomerTypeService.save(tblCustomerType);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerType', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerType' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerType
  })
  async put(@Req() req: Request, @Body() tblCustomerType: TblCustomerType): Promise<TblCustomerType> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerType', tblCustomerType.id);
    return await this.tblCustomerTypeService.update(tblCustomerType);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerType' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerType> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerType', id);
    const toDelete = await this.tblCustomerTypeService.findById(id);
    return await this.tblCustomerTypeService.delete(toDelete);
  }
}
