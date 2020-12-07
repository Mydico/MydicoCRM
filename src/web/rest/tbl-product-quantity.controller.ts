import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblProductQuantity from '../../domain/tbl-product-quantity.entity';
import { TblProductQuantityService } from '../../service/tbl-product-quantity.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-product-quantities')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-product-quantities')
export class TblProductQuantityController {
  logger = new Logger('TblProductQuantityController');

  constructor(private readonly tblProductQuantityService: TblProductQuantityService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblProductQuantity
  })
  async getAll(@Req() req: Request): Promise<TblProductQuantity[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblProductQuantityService.findAndCount({
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
    type: TblProductQuantity
  })
  async getOne(@Param('id') id: string): Promise<TblProductQuantity> {
    return await this.tblProductQuantityService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblProductQuantity' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblProductQuantity
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblProductQuantity: TblProductQuantity): Promise<TblProductQuantity> {
    const created = await this.tblProductQuantityService.save(tblProductQuantity);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductQuantity', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblProductQuantity' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblProductQuantity
  })
  async put(@Req() req: Request, @Body() tblProductQuantity: TblProductQuantity): Promise<TblProductQuantity> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductQuantity', tblProductQuantity.id);
    return await this.tblProductQuantityService.update(tblProductQuantity);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblProductQuantity' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblProductQuantity> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblProductQuantity', id);
    const toDelete = await this.tblProductQuantityService.findById(id);
    return await this.tblProductQuantityService.delete(toDelete);
  }
}
