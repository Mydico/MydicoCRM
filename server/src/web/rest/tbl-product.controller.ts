import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblProduct from '../../domain/tbl-product.entity';
import { TblProductService } from '../../service/tbl-product.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-products')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-products')
export class TblProductController {
  logger = new Logger('TblProductController');

  constructor(private readonly tblProductService: TblProductService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblProduct
  })
  async getAll(@Req() req: Request): Promise<TblProduct[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblProductService.findAndCount({
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
    type: TblProduct
  })
  async getOne(@Param('id') id: string): Promise<TblProduct> {
    return await this.tblProductService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblProduct' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblProduct
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblProduct: TblProduct): Promise<TblProduct> {
    const created = await this.tblProductService.save(tblProduct);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProduct', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblProduct' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblProduct
  })
  async put(@Req() req: Request, @Body() tblProduct: TblProduct): Promise<TblProduct> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProduct', tblProduct.id);
    return await this.tblProductService.update(tblProduct);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblProduct' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblProduct> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblProduct', id);
    const toDelete = await this.tblProductService.findById(id);
    return await this.tblProductService.delete(toDelete);
  }
}
