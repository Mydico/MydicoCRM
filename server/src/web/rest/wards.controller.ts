import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Wards from '../../domain/wards.entity';
import { WardsService } from '../../service/wards.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/wards')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('wards')
export class WardsController {
  logger = new Logger('WardsController');

  constructor(private readonly wardsService: WardsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Wards
  })
  async getAll(@Req() req: Request): Promise<Wards[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.wardsService.findAndCount({
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
    type: Wards
  })
  async getOne(@Param('id') id: string): Promise<Wards> {
    return await this.wardsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create wards' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Wards
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() wards: Wards): Promise<Wards> {
    const created = await this.wardsService.save(wards);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Wards', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update wards' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Wards
  })
  async put(@Req() req: Request, @Body() wards: Wards): Promise<Wards> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Wards', wards.id);
    return await this.wardsService.update(wards);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete wards' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Wards> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Wards', id);
    const toDelete = await this.wardsService.findById(id);
    return await this.wardsService.delete(toDelete);
  }
}
