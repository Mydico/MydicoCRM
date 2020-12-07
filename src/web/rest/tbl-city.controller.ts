import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCity from '../../domain/tbl-city.entity';
import { TblCityService } from '../../service/tbl-city.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-cities')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-cities')
export class TblCityController {
  logger = new Logger('TblCityController');

  constructor(private readonly tblCityService: TblCityService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCity
  })
  async getAll(@Req() req: Request): Promise<TblCity[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCityService.findAndCount({
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
    type: TblCity
  })
  async getOne(@Param('id') id: string): Promise<TblCity> {
    return await this.tblCityService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCity' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCity
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCity: TblCity): Promise<TblCity> {
    const created = await this.tblCityService.save(tblCity);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCity', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCity' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCity
  })
  async put(@Req() req: Request, @Body() tblCity: TblCity): Promise<TblCity> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCity', tblCity.id);
    return await this.tblCityService.update(tblCity);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCity' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCity> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCity', id);
    const toDelete = await this.tblCityService.findById(id);
    return await this.tblCityService.delete(toDelete);
  }
}
