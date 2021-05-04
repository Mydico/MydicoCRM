import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ProductDetails from '../../domain/product-details.entity';
import { ProductDetailsService } from '../../service/product-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/product-details')
@UseGuards(AuthGuard, RolesGuard)
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
        type: ProductDetails,
    })
    async getAll(@Req() req: Request): Promise<ProductDetails[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.productDetailsService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: ProductDetails,
    })
    async getOne(@Param('id') id: string): Promise<ProductDetails> {
        return await this.productDetailsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ProductDetails,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() productDetails: ProductDetails): Promise<ProductDetails> {
        const created = await this.productDetailsService.save(productDetails);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductDetails', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProductDetails,
    })
    async put(@Req() req: Request, @Body() productDetails: ProductDetails): Promise<ProductDetails> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductDetails', productDetails.id);
        return await this.productDetailsService.update(productDetails);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<ProductDetails> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ProductDetails', id);
        const toDelete = await this.productDetailsService.findById(id);
        return await this.productDetailsService.delete(toDelete);
    }
}
