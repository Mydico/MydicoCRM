import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import CustomerCall from '../../domain/customer-call.entity';
import { CustomerCallService } from '../../service/customer-call.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-calls')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('customer-calls')
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
    async getAll(@Req() req: Request): Promise<CustomerCall[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerCallService.findAndCount({
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
        type: CustomerCall,
    })
    async getOne(@Param('id') id: string): Promise<CustomerCall> {
        return await this.customerCallService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create customerCall' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerCall,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() customerCall: CustomerCall): Promise<CustomerCall> {
        const created = await this.customerCallService.save(customerCall);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerCall', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update customerCall' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerCall,
    })
    async put(@Req() req: Request, @Body() customerCall: CustomerCall): Promise<CustomerCall> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerCall', customerCall.id);
        return await this.customerCallService.update(customerCall);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete customerCall' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<CustomerCall> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'CustomerCall', id);
        const toDelete = await this.customerCallService.findById(id);
        return await this.customerCallService.delete(toDelete);
    }
}
