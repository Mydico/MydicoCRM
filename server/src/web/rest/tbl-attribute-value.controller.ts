import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblAttributeValue from '../../domain/tbl-attribute-value.entity';
import { TblAttributeValueService } from '../../service/tbl-attribute-value.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-attribute-values')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-attribute-values')
export class TblAttributeValueController {
  logger = new Logger('TblAttributeValueController');

  constructor(private readonly tblAttributeValueService: TblAttributeValueService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblAttributeValue
  })
  async getAll(@Req() req: Request): Promise<TblAttributeValue[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblAttributeValueService.findAndCount({
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
    type: TblAttributeValue
  })
  async getOne(@Param('id') id: string): Promise<TblAttributeValue> {
    return await this.tblAttributeValueService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblAttributeValue' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblAttributeValue
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblAttributeValue: TblAttributeValue): Promise<TblAttributeValue> {
    const created = await this.tblAttributeValueService.save(tblAttributeValue);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblAttributeValue', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblAttributeValue' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblAttributeValue
  })
  async put(@Req() req: Request, @Body() tblAttributeValue: TblAttributeValue): Promise<TblAttributeValue> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblAttributeValue', tblAttributeValue.id);
    return await this.tblAttributeValueService.update(tblAttributeValue);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblAttributeValue' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblAttributeValue> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblAttributeValue', id);
    const toDelete = await this.tblAttributeValueService.findById(id);
    return await this.tblAttributeValueService.delete(toDelete);
  }
}
