import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PromotionProduct from '../../domain/promotion-product.entity';
import { PromotionProductService } from '../../service/promotion-product.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/promotion-products')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('promotion-products')
export class PromotionProductController {
  logger = new Logger('PromotionProductController');

  constructor(private readonly promotionProductService: PromotionProductService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PromotionProduct
  })
  async getAll(@Req() req: Request): Promise<PromotionProduct[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.promotionProductService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/many')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PromotionProduct
  })
  async getAllAtOnce(@Req() req: Request): Promise<PromotionProduct[]> {
    console.log(req.query.ids)
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.promotionProductService.findManyByManyId(JSON.parse(req.query.ids));
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: PromotionProduct
  })
  async getOne(@Param('id') id: string): Promise<PromotionProduct> {
    return await this.promotionProductService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create promotionProduct' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PromotionProduct
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() promotionProduct: PromotionProduct): Promise<PromotionProduct> {
    const created = await this.promotionProductService.save(promotionProduct);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PromotionProduct', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update promotionProduct' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PromotionProduct
  })
  async put(@Req() req: Request, @Body() promotionProduct: PromotionProduct): Promise<PromotionProduct> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PromotionProduct', promotionProduct.id);
    return await this.promotionProductService.update(promotionProduct);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete promotionProduct' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<PromotionProduct> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'PromotionProduct', id);
    const toDelete = await this.promotionProductService.findById(id);
    return await this.promotionProductService.delete(toDelete);
  }
}
