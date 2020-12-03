import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblSite from '../../domain/tbl-site.entity';
import { TblSiteService } from '../../service/tbl-site.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-sites')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-sites')
export class TblSiteController {
  logger = new Logger('TblSiteController');

  constructor(private readonly tblSiteService: TblSiteService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblSite
  })
  async getAll(@Req() req: Request): Promise<TblSite[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblSiteService.findAndCount({
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
    type: TblSite
  })
  async getOne(@Param('id') id: string): Promise<TblSite> {
    return await this.tblSiteService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblSite' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblSite
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblSite: TblSite): Promise<TblSite> {
    const created = await this.tblSiteService.save(tblSite);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblSite', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblSite' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblSite
  })
  async put(@Req() req: Request, @Body() tblSite: TblSite): Promise<TblSite> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblSite', tblSite.id);
    return await this.tblSiteService.update(tblSite);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblSite' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblSite> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblSite', id);
    const toDelete = await this.tblSiteService.findById(id);
    return await this.tblSiteService.delete(toDelete);
  }
}
