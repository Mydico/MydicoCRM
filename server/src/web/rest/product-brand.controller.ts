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
    CacheInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import ProductBrand from '../../domain/product-brand.entity';
import { ProductBrandService } from '../../service/product-brand.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/product-brands')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
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
    async getAll(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.productBrandService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: ProductBrand,
    })
    async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        return res.send(await this.productBrandService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ProductBrand,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() productBrand: ProductBrand): Promise<Response> {
        const created = await this.productBrandService.save(productBrand);
        HeaderUtil.addEntityCreatedHeaders(res, 'ProductBrand', created.id);
        return res.send(created);
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProductBrand,
    })
    async put(@Res() res: Response, @Body() productBrand: ProductBrand): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'ProductBrand', productBrand.id);
        return res.send(await this.productBrandService.update(productBrand));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<ProductBrand> {
        HeaderUtil.addEntityDeletedHeaders(res, 'ProductBrand', id);
        const toDelete = await this.productBrandService.findById(id);
        return await this.productBrandService.delete(toDelete);
    }
}
