import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Provider from '../../domain/provider.entity';
import { ProviderService } from '../../service/provider.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/providers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('providers')
export class ProviderController {
  logger = new Logger('ProviderController');

  constructor(private readonly providerService: ProviderService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Provider
  })
  async getAll(@Req() req: Request): Promise<Provider[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.providerService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      ...filter
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Provider
  })
  async getOne(@Param('id') id: string): Promise<Provider> {
    return await this.providerService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create provider' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Provider
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() provider: Provider): Promise<Provider> {
    const created = await this.providerService.save(provider);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Provider', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update provider' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Provider
  })
  async put(@Req() req: Request, @Body() provider: Provider): Promise<Provider> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Provider', provider.id);
    return await this.providerService.update(provider);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete provider' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Provider> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Provider', id);
    const toDelete = await this.providerService.findById(id);
    return await this.providerService.delete(toDelete);
  }
}
