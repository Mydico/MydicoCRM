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
import ProductDetails from '../../domain/product-details.entity';
import { ProductDetailsService } from '../../service/product-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/product-details')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class ProductDetailsController {
  logger = new Logger('ProductDetailsController');

  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductDetails
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.productDetailsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductDetails
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.productDetailsService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProductDetails
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() productDetails: ProductDetails): Promise<Response> {
    const created = await this.productDetailsService.save(productDetails);
    HeaderUtil.addEntityCreatedHeaders(res, 'ProductDetails', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProductDetails
  })
  async put(@Res() res: Response, @Body() productDetails: ProductDetails): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'ProductDetails', productDetails.id);
    return res.send(await this.productDetailsService.update(productDetails));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<ProductDetails> {
    HeaderUtil.addEntityDeletedHeaders(res, 'ProductDetails', id);
    const toDelete = await this.productDetailsService.findById(id);
    return await this.productDetailsService.delete(toDelete);
  }
}
