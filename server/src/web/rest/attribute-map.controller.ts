import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import AttributeMap from '../../domain/attribute-map.entity';
import { AttributeMapService } from '../../service/attribute-map.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/attribute-maps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('attribute-maps')
export class AttributeMapController {
  logger = new Logger('AttributeMapController');

  constructor(private readonly attributeMapService: AttributeMapService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: AttributeMap
  })
  async getAll(@Req() req: Request): Promise<AttributeMap[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.attributeMapService.findAndCount({
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
    type: AttributeMap
  })
  async getOne(@Param('id') id: string): Promise<AttributeMap> {
    return await this.attributeMapService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create attributeMap' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AttributeMap
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() attributeMap: AttributeMap): Promise<AttributeMap> {
    const created = await this.attributeMapService.save(attributeMap);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AttributeMap', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update attributeMap' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AttributeMap
  })
  async put(@Req() req: Request, @Body() attributeMap: AttributeMap): Promise<AttributeMap> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AttributeMap', attributeMap.id);
    return await this.attributeMapService.update(attributeMap);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete attributeMap' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<AttributeMap> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'AttributeMap', id);
    const toDelete = await this.attributeMapService.findById(id);
    return await this.attributeMapService.delete(toDelete);
  }
}