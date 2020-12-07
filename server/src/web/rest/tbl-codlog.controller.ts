import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCodlog from '../../domain/tbl-codlog.entity';
import { TblCodlogService } from '../../service/tbl-codlog.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-codlogs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-codlogs')
export class TblCodlogController {
  logger = new Logger('TblCodlogController');

  constructor(private readonly tblCodlogService: TblCodlogService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCodlog
  })
  async getAll(@Req() req: Request): Promise<TblCodlog[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCodlogService.findAndCount({
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
    type: TblCodlog
  })
  async getOne(@Param('id') id: string): Promise<TblCodlog> {
    return await this.tblCodlogService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCodlog' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCodlog
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCodlog: TblCodlog): Promise<TblCodlog> {
    const created = await this.tblCodlogService.save(tblCodlog);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCodlog', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCodlog' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCodlog
  })
  async put(@Req() req: Request, @Body() tblCodlog: TblCodlog): Promise<TblCodlog> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCodlog', tblCodlog.id);
    return await this.tblCodlogService.update(tblCodlog);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCodlog' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCodlog> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCodlog', id);
    const toDelete = await this.tblCodlogService.findById(id);
    return await this.tblCodlogService.delete(toDelete);
  }
}
