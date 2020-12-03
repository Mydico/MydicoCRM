import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblProductGroupMap from '../../domain/tbl-product-group-map.entity';
import { TblProductGroupMapService } from '../../service/tbl-product-group-map.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-product-group-maps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-product-group-maps')
export class TblProductGroupMapController {
  logger = new Logger('TblProductGroupMapController');

  constructor(private readonly tblProductGroupMapService: TblProductGroupMapService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblProductGroupMap
  })
  async getAll(@Req() req: Request): Promise<TblProductGroupMap[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblProductGroupMapService.findAndCount({
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
    type: TblProductGroupMap
  })
  async getOne(@Param('id') id: string): Promise<TblProductGroupMap> {
    return await this.tblProductGroupMapService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblProductGroupMap' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblProductGroupMap
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblProductGroupMap: TblProductGroupMap): Promise<TblProductGroupMap> {
    const created = await this.tblProductGroupMapService.save(tblProductGroupMap);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductGroupMap', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblProductGroupMap' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblProductGroupMap
  })
  async put(@Req() req: Request, @Body() tblProductGroupMap: TblProductGroupMap): Promise<TblProductGroupMap> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductGroupMap', tblProductGroupMap.id);
    return await this.tblProductGroupMapService.update(tblProductGroupMap);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblProductGroupMap' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblProductGroupMap> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblProductGroupMap', id);
    const toDelete = await this.tblProductGroupMapService.findById(id);
    return await this.tblProductGroupMapService.delete(toDelete);
  }
}
