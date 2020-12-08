import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import SiteMapDomain from '../../domain/site-map-domain.entity';
import { SiteMapDomainService } from '../../service/site-map-domain.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/site-map-domains')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('site-map-domains')
export class SiteMapDomainController {
  logger = new Logger('SiteMapDomainController');

  constructor(private readonly siteMapDomainService: SiteMapDomainService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SiteMapDomain
  })
  async getAll(@Req() req: Request): Promise<SiteMapDomain[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.siteMapDomainService.findAndCount({
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
    type: SiteMapDomain
  })
  async getOne(@Param('id') id: string): Promise<SiteMapDomain> {
    return await this.siteMapDomainService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create siteMapDomain' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: SiteMapDomain
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() siteMapDomain: SiteMapDomain): Promise<SiteMapDomain> {
    const created = await this.siteMapDomainService.save(siteMapDomain);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SiteMapDomain', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update siteMapDomain' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SiteMapDomain
  })
  async put(@Req() req: Request, @Body() siteMapDomain: SiteMapDomain): Promise<SiteMapDomain> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SiteMapDomain', siteMapDomain.id);
    return await this.siteMapDomainService.update(siteMapDomain);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete siteMapDomain' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<SiteMapDomain> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'SiteMapDomain', id);
    const toDelete = await this.siteMapDomainService.findById(id);
    return await this.siteMapDomainService.delete(toDelete);
  }
}
