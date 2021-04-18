import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ProductGroupMap from '../../domain/product-group-map.entity';
import { ProductGroupMapService } from '../../service/product-group-map.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/product-group-maps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('product-group-maps')
export class ProductGroupMapController {
    logger = new Logger('ProductGroupMapController');

    constructor(private readonly productGroupMapService: ProductGroupMapService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ProductGroupMap,
    })
    async getAll(@Req() req: Request): Promise<ProductGroupMap[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.productGroupMapService.findAndCount({
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
        type: ProductGroupMap,
    })
    async getOne(@Param('id') id: string): Promise<ProductGroupMap> {
        return await this.productGroupMapService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create productGroupMap' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ProductGroupMap,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() productGroupMap: ProductGroupMap): Promise<ProductGroupMap> {
        const created = await this.productGroupMapService.save(productGroupMap);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductGroupMap', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update productGroupMap' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProductGroupMap,
    })
    async put(@Req() req: Request, @Body() productGroupMap: ProductGroupMap): Promise<ProductGroupMap> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ProductGroupMap', productGroupMap.id);
        return await this.productGroupMapService.update(productGroupMap);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete productGroupMap' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<ProductGroupMap> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ProductGroupMap', id);
        const toDelete = await this.productGroupMapService.findById(id);
        return await this.productGroupMapService.delete(toDelete);
    }
}
