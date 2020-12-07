import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblProductGroup from '../../domain/tbl-product-group.entity';
import { TblProductGroupService } from '../../service/tbl-product-group.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-product-groups')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-product-groups')
export class TblProductGroupController {
  logger = new Logger('TblProductGroupController');

  constructor(private readonly tblProductGroupService: TblProductGroupService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblProductGroup
  })
  async getAll(@Req() req: Request): Promise<TblProductGroup[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblProductGroupService.findAndCount({
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
    type: TblProductGroup
  })
  async getOne(@Param('id') id: string): Promise<TblProductGroup> {
    return await this.tblProductGroupService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblProductGroup' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblProductGroup
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblProductGroup: TblProductGroup): Promise<TblProductGroup> {
    const created = await this.tblProductGroupService.save(tblProductGroup);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductGroup', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblProductGroup' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblProductGroup
  })
  async put(@Req() req: Request, @Body() tblProductGroup: TblProductGroup): Promise<TblProductGroup> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductGroup', tblProductGroup.id);
    return await this.tblProductGroupService.update(tblProductGroup);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblProductGroup' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblProductGroup> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblProductGroup', id);
    const toDelete = await this.tblProductGroupService.findById(id);
    return await this.tblProductGroupService.delete(toDelete);
  }
}
