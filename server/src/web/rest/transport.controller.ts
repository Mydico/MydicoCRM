import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Transport from '../../domain/transport.entity';
import { TransportService } from '../../service/transport.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transports')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('transports')
export class TransportController {
  logger = new Logger('TransportController');

  constructor(private readonly transportService: TransportService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Transport
  })
  async getAll(@Req() req: Request): Promise<Transport[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.transportService.findAndCount({
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
    type: Transport
  })
  async getOne(@Param('id') id: string): Promise<Transport> {
    return await this.transportService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create transport' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Transport
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() transport: Transport): Promise<Transport> {
    const created = await this.transportService.save(transport);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Transport', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update transport' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Transport
  })
  async put(@Req() req: Request, @Body() transport: Transport): Promise<Transport> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Transport', transport.id);
    return await this.transportService.update(transport);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete transport' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Transport> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Transport', id);
    const toDelete = await this.transportService.findById(id);
    return await this.transportService.delete(toDelete);
  }
}
