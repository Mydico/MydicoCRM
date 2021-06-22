import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerCategory from '../../domain/customer-category.entity';
import { CustomerCategoryService } from '../../service/customer-category.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-categories')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerCategoryController {
    logger = new Logger('CustomerCategoryController');

    constructor(private readonly customerCategoryService: CustomerCategoryService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerCategory,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerCategory[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerCategoryService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CustomerCategory,
    })
    async getOne(@Param('id') id: string): Promise<CustomerCategory> {
        return await this.customerCategoryService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)

    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerCategory,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerCategory: CustomerCategory): Promise<CustomerCategory> {
        const created = await this.customerCategoryService.save(customerCategory);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerCategory', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)

    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerCategory,
    })
    async put(@Res() res: Response, @Body() customerCategory: CustomerCategory): Promise<CustomerCategory> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerCategory', customerCategory.id);
        return await this.customerCategoryService.update(customerCategory);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)

    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerCategory> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerCategory', id);
        const toDelete = await this.customerCategoryService.findById(id);
        return await this.customerCategoryService.delete(toDelete);
    }
}
