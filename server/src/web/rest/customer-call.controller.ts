import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerCall from '../../domain/customer-call.entity';
import { CustomerCallService } from '../../service/customer-call.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-calls')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerCallController {
    logger = new Logger('CustomerCallController');

    constructor(private readonly customerCallService: CustomerCallService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerCall,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerCall[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerCallService.findAndCount({
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
        type: CustomerCall,
    })
    async getOne(@Param('id') id: string): Promise<CustomerCall> {
        return await this.customerCallService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerCall,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerCall: CustomerCall): Promise<CustomerCall> {
        const created = await this.customerCallService.save(customerCall);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerCall', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerCall,
    })
    async put(@Res() res: Response, @Body() customerCall: CustomerCall): Promise<CustomerCall> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerCall', customerCall.id);
        return await this.customerCallService.update(customerCall);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerCall> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerCall', id);
        const toDelete = await this.customerCallService.findById(id);
        return await this.customerCallService.delete(toDelete);
    }
}
