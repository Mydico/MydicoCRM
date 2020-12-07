import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblSiteMapDomain from '../../domain/tbl-site-map-domain.entity';
import { TblSiteMapDomainService } from '../../service/tbl-site-map-domain.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-site-map-domains')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-site-map-domains')
export class TblSiteMapDomainController {
  logger = new Logger('TblSiteMapDomainController');

  constructor(private readonly tblSiteMapDomainService: TblSiteMapDomainService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblSiteMapDomain
  })
  async getAll(@Req() req: Request): Promise<TblSiteMapDomain[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblSiteMapDomainService.findAndCount({
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
    type: TblSiteMapDomain
  })
  async getOne(@Param('id') id: string): Promise<TblSiteMapDomain> {
    return await this.tblSiteMapDomainService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblSiteMapDomain' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblSiteMapDomain
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblSiteMapDomain: TblSiteMapDomain): Promise<TblSiteMapDomain> {
    const created = await this.tblSiteMapDomainService.save(tblSiteMapDomain);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblSiteMapDomain', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblSiteMapDomain' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblSiteMapDomain
  })
  async put(@Req() req: Request, @Body() tblSiteMapDomain: TblSiteMapDomain): Promise<TblSiteMapDomain> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblSiteMapDomain', tblSiteMapDomain.id);
    return await this.tblSiteMapDomainService.update(tblSiteMapDomain);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblSiteMapDomain' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblSiteMapDomain> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblSiteMapDomain', id);
    const toDelete = await this.tblSiteMapDomainService.findById(id);
    return await this.tblSiteMapDomainService.delete(toDelete);
  }
}
