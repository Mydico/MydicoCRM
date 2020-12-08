import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Store from '../../domain/store.entity';
import { StoreService } from '../../service/store.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/stores')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('stores')
export class StoreController {
  logger = new Logger('StoreController');

  constructor(private readonly storeService: StoreService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Store
  })
  async getAll(@Req() req: Request): Promise<Store[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.storeService.findAndCount({
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
    type: Store
  })
  async getOne(@Param('id') id: string): Promise<Store> {
    return await this.storeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create store' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Store
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() store: Store): Promise<Store> {
    const created = await this.storeService.save(store);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Store', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update store' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Store
  })
  async put(@Req() req: Request, @Body() store: Store): Promise<Store> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Store', store.id);
    return await this.storeService.update(store);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete store' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Store> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Store', id);
    const toDelete = await this.storeService.findById(id);
    return await this.storeService.delete(toDelete);
  }
}
