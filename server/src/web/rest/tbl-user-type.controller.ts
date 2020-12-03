import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblUserType from '../../domain/tbl-user-type.entity';
import { TblUserTypeService } from '../../service/tbl-user-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-user-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-user-types')
export class TblUserTypeController {
  logger = new Logger('TblUserTypeController');

  constructor(private readonly tblUserTypeService: TblUserTypeService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblUserType
  })
  async getAll(@Req() req: Request): Promise<TblUserType[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblUserTypeService.findAndCount({
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
    type: TblUserType
  })
  async getOne(@Param('id') id: string): Promise<TblUserType> {
    return await this.tblUserTypeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblUserType' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblUserType
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblUserType: TblUserType): Promise<TblUserType> {
    const created = await this.tblUserTypeService.save(tblUserType);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserType', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblUserType' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblUserType
  })
  async put(@Req() req: Request, @Body() tblUserType: TblUserType): Promise<TblUserType> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserType', tblUserType.id);
    return await this.tblUserTypeService.update(tblUserType);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblUserType' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblUserType> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblUserType', id);
    const toDelete = await this.tblUserTypeService.findById(id);
    return await this.tblUserTypeService.delete(toDelete);
  }
}
