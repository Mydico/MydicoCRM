import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerMap from '../../domain/tbl-customer-map.entity';
import { TblCustomerMapService } from '../../service/tbl-customer-map.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-maps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-maps')
export class TblCustomerMapController {
  logger = new Logger('TblCustomerMapController');

  constructor(private readonly tblCustomerMapService: TblCustomerMapService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerMap
  })
  async getAll(@Req() req: Request): Promise<TblCustomerMap[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerMapService.findAndCount({
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
    type: TblCustomerMap
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerMap> {
    return await this.tblCustomerMapService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerMap' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerMap
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerMap: TblCustomerMap): Promise<TblCustomerMap> {
    const created = await this.tblCustomerMapService.save(tblCustomerMap);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerMap', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerMap' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerMap
  })
  async put(@Req() req: Request, @Body() tblCustomerMap: TblCustomerMap): Promise<TblCustomerMap> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerMap', tblCustomerMap.id);
    return await this.tblCustomerMapService.update(tblCustomerMap);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerMap' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerMap> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerMap', id);
    const toDelete = await this.tblCustomerMapService.findById(id);
    return await this.tblCustomerMapService.delete(toDelete);
  }
}
