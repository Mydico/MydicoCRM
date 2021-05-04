import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ProductQuantity from '../../domain/product-quantity.entity';
import { ProductQuantityService } from '../../service/product-quantity.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { In, Like } from 'typeorm';

@Controller('api/product-quantities')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class ProductQuantityController {
  logger = new Logger('ProductQuantityController');

  constructor(private readonly productQuantityService: ProductQuantityService) {}

  @Get('/quantity')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getQuantity(@Req() req: Request): Promise<ProductQuantity[]> {
    const results = await this.productQuantityService.findByfields({
      where: {
        product: req.query.productId,
        store: req.query.storeId
      }
    });
    return results;
  }

  @Get('/field')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getField(@Req() req: Request): Promise<ProductQuantity[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        try {
          const arr = JSON.parse(req.query[item]);
          if (Array.isArray(arr)) {
            filter[item] = In(arr);
          } else {
            filter[item] = Like(`%${req.query[item]}%`);
          }
        } catch (e) {
          filter[item] = Like(`%${req.query[item]}%`);
        }
      }
    });
    const results = await this.productQuantityService.findByfields({
      where: {
        ...filter
      }
    });
    return results;
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getAll(@Req() req: Request): Promise<ProductQuantity[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.productQuantityService.findAndCount(pageRequest, req);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductQuantity
  })
  async getOne(@Param('id') id: string): Promise<ProductQuantity> {
    return await this.productQuantityService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
 
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProductQuantity
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() productQuantity: ProductQuantity): Promise<ProductQuantity> {
    const created = await this.productQuantityService.save(productQuantity);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductQuantity', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
 
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProductQuantity
  })
  async put(@Req() req: Request, @Body() productQuantity: ProductQuantity): Promise<ProductQuantity> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductQuantity', productQuantity.id);
    return await this.productQuantityService.update(productQuantity);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
 
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<ProductQuantity> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ProductQuantity', id);
    const toDelete = await this.productQuantityService.findById(id);
    return await this.productQuantityService.delete(toDelete);
  }
}
