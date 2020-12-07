import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblAttribute from '../../domain/tbl-attribute.entity';
import { TblAttributeService } from '../../service/tbl-attribute.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-attributes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-attributes')
export class TblAttributeController {
  logger = new Logger('TblAttributeController');

  constructor(private readonly tblAttributeService: TblAttributeService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblAttribute
  })
  async getAll(@Req() req: Request): Promise<TblAttribute[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblAttributeService.findAndCount({
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
    type: TblAttribute
  })
  async getOne(@Param('id') id: string): Promise<TblAttribute> {
    return await this.tblAttributeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblAttribute' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblAttribute
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblAttribute: TblAttribute): Promise<TblAttribute> {
    const created = await this.tblAttributeService.save(tblAttribute);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblAttribute', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblAttribute' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblAttribute
  })
  async put(@Req() req: Request, @Body() tblAttribute: TblAttribute): Promise<TblAttribute> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblAttribute', tblAttribute.id);
    return await this.tblAttributeService.update(tblAttribute);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblAttribute' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblAttribute> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblAttribute', id);
    const toDelete = await this.tblAttributeService.findById(id);
    return await this.tblAttributeService.delete(toDelete);
  }
}
