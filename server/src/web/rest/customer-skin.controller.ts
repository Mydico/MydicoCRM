import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import CustomerSkin from '../../domain/customer-skin.entity';
import { CustomerSkinService } from '../../service/customer-skin.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-skins')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerSkinController {
    logger = new Logger('CustomerSkinController');

    constructor(private readonly customerSkinService: CustomerSkinService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerSkin,
    })
    async getAll(@Req() req: Request): Promise<CustomerSkin[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerSkinService.findAndCount({
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
        type: CustomerSkin,
    })
    async getOne(@Param('id') id: string): Promise<CustomerSkin> {
        return await this.customerSkinService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerSkin,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() customerSkin: CustomerSkin): Promise<CustomerSkin> {
        const created = await this.customerSkinService.save(customerSkin);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerSkin', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerSkin,
    })
    async put(@Req() req: Request, @Body() customerSkin: CustomerSkin): Promise<CustomerSkin> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerSkin', customerSkin.id);
        return await this.customerSkinService.update(customerSkin);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<CustomerSkin> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'CustomerSkin', id);
        const toDelete = await this.customerSkinService.findById(id);
        return await this.customerSkinService.delete(toDelete);
    }
}
