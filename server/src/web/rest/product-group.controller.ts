import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import ProductGroup from '../../domain/product-group.entity';
import { ProductGroupService } from '../../service/product-group.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/product-groups')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
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
  async getAll(@Req() req: Request, @Res() res): Promise<ProductGroup[]> {
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
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
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductGroup
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.productGroupService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProductGroup
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() productGroup: ProductGroup): Promise<Response> {
    const created = await this.productGroupService.save(productGroup);
    HeaderUtil.addEntityCreatedHeaders(res, 'ProductGroup', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProductGroup
  })
  async put(@Res() res: Response, @Body() productGroup: ProductGroup): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'ProductGroup', productGroup.id);
    return res.send(await this.productGroupService.update(productGroup));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<ProductGroup> {
    HeaderUtil.addEntityDeletedHeaders(res, 'ProductGroup', id);
    const toDelete = await this.productGroupService.findById(id);
    return await this.productGroupService.delete(toDelete);
  }
}
