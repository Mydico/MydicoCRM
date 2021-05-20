import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerAdvisory from '../../domain/customer-advisory.entity';
import { CustomerAdvisoryService } from '../../service/customer-advisory.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-advisories')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerAdvisoryController {
    logger = new Logger('CustomerAdvisoryController');

    constructor(private readonly customerAdvisoryService: CustomerAdvisoryService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerAdvisory,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerAdvisory[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerAdvisoryService.findAndCount({
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
        type: CustomerAdvisory,
    })
    async getOne(@Param('id') id: string): Promise<CustomerAdvisory> {
        return await this.customerAdvisoryService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerAdvisory,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerAdvisory: CustomerAdvisory): Promise<CustomerAdvisory> {
        const created = await this.customerAdvisoryService.save(customerAdvisory);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerAdvisory', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerAdvisory,
    })
    async put(@Res() res: Response, @Body() customerAdvisory: CustomerAdvisory): Promise<CustomerAdvisory> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerAdvisory', customerAdvisory.id);
        return await this.customerAdvisoryService.update(customerAdvisory);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerAdvisory> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerAdvisory', id);
        const toDelete = await this.customerAdvisoryService.findById(id);
        return await this.customerAdvisoryService.delete(toDelete);
    }
}
