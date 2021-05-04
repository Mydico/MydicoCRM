import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import CustomerDebit from '../../domain/customer-debit.entity';
import { CustomerDebitService } from '../../service/customer-debit.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm/find-options/operator/Like';

@Controller('api/customer-debits')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerDebitController {
    logger = new Logger('CustomerDebitController');

    constructor(private readonly customerDebitService: CustomerDebitService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerDebit,
    })
    async getAll(@Req() req: Request): Promise<CustomerDebit[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.customerDebitService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                ...filter,
            },
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CustomerDebit,
    })
    async getOne(@Param('id') id: string): Promise<CustomerDebit> {
        return await this.customerDebitService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerDebit,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() customerDebit: CustomerDebit): Promise<CustomerDebit> {
        const created = await this.customerDebitService.save(customerDebit);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerDebit', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerDebit,
    })
    async put(@Req() req: Request, @Body() customerDebit: CustomerDebit): Promise<CustomerDebit> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerDebit', customerDebit.id);
        return await this.customerDebitService.update(customerDebit);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<CustomerDebit> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'CustomerDebit', id);
        const toDelete = await this.customerDebitService.findById(id);
        return await this.customerDebitService.delete(toDelete);
    }
}
