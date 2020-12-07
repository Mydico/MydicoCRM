import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblDistrict from '../../domain/tbl-district.entity';
import { TblDistrictService } from '../../service/tbl-district.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-districts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-districts')
export class TblDistrictController {
  logger = new Logger('TblDistrictController');

  constructor(private readonly tblDistrictService: TblDistrictService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblDistrict
  })
  async getAll(@Req() req: Request): Promise<TblDistrict[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblDistrictService.findAndCount({
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
    type: TblDistrict
  })
  async getOne(@Param('id') id: string): Promise<TblDistrict> {
    return await this.tblDistrictService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblDistrict' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblDistrict
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblDistrict: TblDistrict): Promise<TblDistrict> {
    const created = await this.tblDistrictService.save(tblDistrict);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblDistrict', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblDistrict' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblDistrict
  })
  async put(@Req() req: Request, @Body() tblDistrict: TblDistrict): Promise<TblDistrict> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblDistrict', tblDistrict.id);
    return await this.tblDistrictService.update(tblDistrict);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblDistrict' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblDistrict> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblDistrict', id);
    const toDelete = await this.tblDistrictService.findById(id);
    return await this.tblDistrictService.delete(toDelete);
  }
}
