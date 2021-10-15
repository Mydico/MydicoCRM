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
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import ProductQuantity from '../../domain/product-quantity.entity';
import { ProductQuantityService } from '../../service/product-quantity.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Equal, In, Like } from 'typeorm';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';
import { ProductStatus } from '../../domain/enumeration/product-status';

@Controller('api/product-quantities')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class ProductQuantityController {
  logger = new Logger('ProductQuantityController');

  constructor(private readonly productQuantityService: ProductQuantityService, private readonly departmentService: DepartmentService) {}

  @Get('/quantity')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getQuantity(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const results = await this.productQuantityService.findByfields({
      where: {
        product: req.query.productId,
        store: req.query.storeId,
        status: ProductStatus.ACTIVE
      }
    });
    return res.send(results);
  }

  @Get('/field')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getField(@Req() req: Request, @Res() res): Promise<Response> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        try {
          const arr = JSON.parse(req.query[item]);
          if (Array.isArray(arr)) {
            filter[item] = In(arr);
          } else {
            filter[item] = Equal(`${req.query[item]}`);
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
    return res.send(results);
  }

  @Get('/find')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async find(@Req() req: Request, @Res() res): Promise<Response> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter: any = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    const [results, count] = await this.productQuantityService.filter(filter, {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/count')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getAllCount(@Req() req: Request, @Res() res): Promise<Response> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter: any = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    const currentUser = req.user as User;
    let departmentVisible = [];
    if (currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
        departmentVisible.push(currentUser.department.id);
    }
    const results = await this.productQuantityService.countProduct(filter, departmentVisible, {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    return res.send(results);
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductQuantity
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Response> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter: any = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    const currentUser = req.user as User;
    let departmentVisible = [];
    if (currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
        departmentVisible.push(currentUser.department.id);
    }
    const [results, count] = await this.productQuantityService.findAndCount(filter, departmentVisible, {
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }


  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProductQuantity
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() productQuantity: ProductQuantity): Promise<Response> {
    const created = await this.productQuantityService.save(productQuantity);
    HeaderUtil.addEntityCreatedHeaders(res, 'ProductQuantity', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProductQuantity
  })
  async put(@Res() res: Response, @Body() productQuantity: ProductQuantity): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'ProductQuantity', productQuantity.id);
    return res.send(await this.productQuantityService.update(productQuantity));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<ProductQuantity> {
    HeaderUtil.addEntityDeletedHeaders(res, 'ProductQuantity', id);
    const toDelete = await this.productQuantityService.findById(id);
    return await this.productQuantityService.delete(toDelete);
  }
}
