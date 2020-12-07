import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblAttributeMap from '../../domain/tbl-attribute-map.entity';
import { TblAttributeMapService } from '../../service/tbl-attribute-map.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-attribute-maps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-attribute-maps')
export class TblAttributeMapController {
  logger = new Logger('TblAttributeMapController');

  constructor(private readonly tblAttributeMapService: TblAttributeMapService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblAttributeMap
  })
  async getAll(@Req() req: Request): Promise<TblAttributeMap[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblAttributeMapService.findAndCount({
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
    type: TblAttributeMap
  })
  async getOne(@Param('id') id: string): Promise<TblAttributeMap> {
    return await this.tblAttributeMapService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblAttributeMap' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblAttributeMap
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblAttributeMap: TblAttributeMap): Promise<TblAttributeMap> {
    const created = await this.tblAttributeMapService.save(tblAttributeMap);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblAttributeMap', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblAttributeMap' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblAttributeMap
  })
  async put(@Req() req: Request, @Body() tblAttributeMap: TblAttributeMap): Promise<TblAttributeMap> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblAttributeMap', tblAttributeMap.id);
    return await this.tblAttributeMapService.update(tblAttributeMap);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblAttributeMap' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblAttributeMap> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblAttributeMap', id);
    const toDelete = await this.tblAttributeMapService.findById(id);
    return await this.tblAttributeMapService.delete(toDelete);
  }
}
