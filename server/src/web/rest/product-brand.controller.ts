import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ProductBrand from '../../domain/product-brand.entity';
import { ProductBrandService } from '../../service/product-brand.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/product-brands')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('product-brands')
export class ProductBrandController {
    logger = new Logger('ProductBrandController');

    constructor(private readonly productBrandService: ProductBrandService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ProductBrand,
    })
    async getAll(@Req() req: Request): Promise<ProductBrand[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.productBrandService.findAndCount({
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
        type: ProductBrand,
    })
    async getOne(@Param('id') id: string): Promise<ProductBrand> {
        return await this.productBrandService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create productBrand' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ProductBrand,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() productBrand: ProductBrand): Promise<ProductBrand> {
        const created = await this.productBrandService.save(productBrand);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductBrand', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update productBrand' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProductBrand,
    })
    async put(@Req() req: Request, @Body() productBrand: ProductBrand): Promise<ProductBrand> {
        HeaderUtil.addEntityUpdatedHeaders(req.res, 'ProductBrand', productBrand.id);
        return await this.productBrandService.update(productBrand);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete productBrand' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<ProductBrand> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ProductBrand', id);
        const toDelete = await this.productBrandService.findById(id);
        return await this.productBrandService.delete(toDelete);
    }
}
