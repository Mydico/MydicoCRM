import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ProductGroup from '../../domain/product-group.entity';
import { ProductGroupService } from '../../service/product-group.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/product-groups')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('product-groups')
export class ProductGroupController {
  logger = new Logger('ProductGroupController');

  constructor(private readonly productGroupService: ProductGroupService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductGroup
  })
  async getAll(@Req() req: Request): Promise<ProductGroup[]> {
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.productGroupService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductGroup
  })
  async getOne(@Param('id') id: string): Promise<ProductGroup> {
    return await this.productGroupService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create productGroup' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProductGroup
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() productGroup: ProductGroup): Promise<ProductGroup> {
    const created = await this.productGroupService.save(productGroup);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductGroup', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update productGroup' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProductGroup
  })
  async put(@Req() req: Request, @Body() productGroup: ProductGroup): Promise<ProductGroup> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductGroup', productGroup.id);
    return await this.productGroupService.update(productGroup);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete productGroup' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<ProductGroup> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ProductGroup', id);
    const toDelete = await this.productGroupService.findById(id);
    return await this.productGroupService.delete(toDelete);
  }
}
