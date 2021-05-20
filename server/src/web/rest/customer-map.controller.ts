import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerMap from '../../domain/customer-map.entity';
import { CustomerMapService } from '../../service/customer-map.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-maps')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerMapController {
    logger = new Logger('CustomerMapController');

    constructor(private readonly customerMapService: CustomerMapService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerMap,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerMap[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerMapService.findAndCount({
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
        type: CustomerMap,
    })
    async getOne(@Param('id') id: string): Promise<CustomerMap> {
        return await this.customerMapService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerMap,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerMap: CustomerMap): Promise<CustomerMap> {
        const created = await this.customerMapService.save(customerMap);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerMap', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerMap,
    })
    async put(@Res() res: Response, @Body() customerMap: CustomerMap): Promise<CustomerMap> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerMap', customerMap.id);
        return await this.customerMapService.update(customerMap);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerMap> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerMap', id);
        const toDelete = await this.customerMapService.findById(id);
        return await this.customerMapService.delete(toDelete);
    }
}
