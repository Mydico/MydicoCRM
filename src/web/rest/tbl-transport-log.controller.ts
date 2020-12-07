import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblTransportLog from '../../domain/tbl-transport-log.entity';
import { TblTransportLogService } from '../../service/tbl-transport-log.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-transport-logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-transport-logs')
export class TblTransportLogController {
  logger = new Logger('TblTransportLogController');

  constructor(private readonly tblTransportLogService: TblTransportLogService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblTransportLog
  })
  async getAll(@Req() req: Request): Promise<TblTransportLog[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblTransportLogService.findAndCount({
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
    type: TblTransportLog
  })
  async getOne(@Param('id') id: string): Promise<TblTransportLog> {
    return await this.tblTransportLogService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblTransportLog' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblTransportLog
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblTransportLog: TblTransportLog): Promise<TblTransportLog> {
    const created = await this.tblTransportLogService.save(tblTransportLog);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblTransportLog', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblTransportLog' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblTransportLog
  })
  async put(@Req() req: Request, @Body() tblTransportLog: TblTransportLog): Promise<TblTransportLog> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblTransportLog', tblTransportLog.id);
    return await this.tblTransportLogService.update(tblTransportLog);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblTransportLog' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblTransportLog> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblTransportLog', id);
    const toDelete = await this.tblTransportLogService.findById(id);
    return await this.tblTransportLogService.delete(toDelete);
  }
}
