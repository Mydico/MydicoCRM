import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerRequest from '../../domain/customer-request.entity';
import { CustomerRequestService } from '../../service/customer-request.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-requests')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerRequestController {
    logger = new Logger('CustomerRequestController');

    constructor(private readonly customerRequestService: CustomerRequestService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerRequest,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerRequest[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerRequestService.findAndCount({
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
        type: CustomerRequest,
    })
    async getOne(@Param('id') id: string): Promise<CustomerRequest> {
        return await this.customerRequestService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerRequest,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerRequest: CustomerRequest): Promise<CustomerRequest> {
        const created = await this.customerRequestService.save(customerRequest);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerRequest', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerRequest,
    })
    async put(@Res() res: Response, @Body() customerRequest: CustomerRequest): Promise<CustomerRequest> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerRequest', customerRequest.id);
        return await this.customerRequestService.update(customerRequest);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerRequest> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerRequest', id);
        const toDelete = await this.customerRequestService.findById(id);
        return await this.customerRequestService.delete(toDelete);
    }
}
