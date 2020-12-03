import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblTransport from '../../domain/tbl-transport.entity';
import { TblTransportService } from '../../service/tbl-transport.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-transports')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-transports')
export class TblTransportController {
  logger = new Logger('TblTransportController');

  constructor(private readonly tblTransportService: TblTransportService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblTransport
  })
  async getAll(@Req() req: Request): Promise<TblTransport[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblTransportService.findAndCount({
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
    type: TblTransport
  })
  async getOne(@Param('id') id: string): Promise<TblTransport> {
    return await this.tblTransportService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblTransport' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblTransport
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblTransport: TblTransport): Promise<TblTransport> {
    const created = await this.tblTransportService.save(tblTransport);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblTransport', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblTransport' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblTransport
  })
  async put(@Req() req: Request, @Body() tblTransport: TblTransport): Promise<TblTransport> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblTransport', tblTransport.id);
    return await this.tblTransportService.update(tblTransport);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblTransport' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblTransport> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblTransport', id);
    const toDelete = await this.tblTransportService.findById(id);
    return await this.tblTransportService.delete(toDelete);
  }
}
