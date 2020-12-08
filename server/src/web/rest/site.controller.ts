import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Site from '../../domain/site.entity';
import { SiteService } from '../../service/site.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/sites')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('sites')
export class SiteController {
  logger = new Logger('SiteController');

  constructor(private readonly siteService: SiteService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Site
  })
  async getAll(@Req() req: Request): Promise<Site[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.siteService.findAndCount({
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
    type: Site
  })
  async getOne(@Param('id') id: string): Promise<Site> {
    return await this.siteService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create site' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Site
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() site: Site): Promise<Site> {
    const created = await this.siteService.save(site);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Site', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update site' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Site
  })
  async put(@Req() req: Request, @Body() site: Site): Promise<Site> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Site', site.id);
    return await this.siteService.update(site);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete site' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Site> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Site', id);
    const toDelete = await this.siteService.findById(id);
    return await this.siteService.delete(toDelete);
  }
}
