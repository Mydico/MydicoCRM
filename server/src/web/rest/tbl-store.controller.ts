import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblStore from '../../domain/tbl-store.entity';
import { TblStoreService } from '../../service/tbl-store.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-stores')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-stores')
export class TblStoreController {
  logger = new Logger('TblStoreController');

  constructor(private readonly tblStoreService: TblStoreService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblStore
  })
  async getAll(@Req() req: Request): Promise<TblStore[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblStoreService.findAndCount({
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
    type: TblStore
  })
  async getOne(@Param('id') id: string): Promise<TblStore> {
    return await this.tblStoreService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblStore' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblStore
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblStore: TblStore): Promise<TblStore> {
    const created = await this.tblStoreService.save(tblStore);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblStore', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblStore' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblStore
  })
  async put(@Req() req: Request, @Body() tblStore: TblStore): Promise<TblStore> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblStore', tblStore.id);
    return await this.tblStoreService.update(tblStore);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblStore' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblStore> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblStore', id);
    const toDelete = await this.tblStoreService.findById(id);
    return await this.tblStoreService.delete(toDelete);
  }
}
