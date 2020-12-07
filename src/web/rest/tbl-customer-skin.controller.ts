import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerSkin from '../../domain/tbl-customer-skin.entity';
import { TblCustomerSkinService } from '../../service/tbl-customer-skin.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-skins')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-skins')
export class TblCustomerSkinController {
  logger = new Logger('TblCustomerSkinController');

  constructor(private readonly tblCustomerSkinService: TblCustomerSkinService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerSkin
  })
  async getAll(@Req() req: Request): Promise<TblCustomerSkin[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerSkinService.findAndCount({
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
    type: TblCustomerSkin
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerSkin> {
    return await this.tblCustomerSkinService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerSkin' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerSkin
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerSkin: TblCustomerSkin): Promise<TblCustomerSkin> {
    const created = await this.tblCustomerSkinService.save(tblCustomerSkin);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerSkin', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerSkin' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerSkin
  })
  async put(@Req() req: Request, @Body() tblCustomerSkin: TblCustomerSkin): Promise<TblCustomerSkin> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerSkin', tblCustomerSkin.id);
    return await this.tblCustomerSkinService.update(tblCustomerSkin);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerSkin' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerSkin> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerSkin', id);
    const toDelete = await this.tblCustomerSkinService.findById(id);
    return await this.tblCustomerSkinService.delete(toDelete);
  }
}
