import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Customer from '../../domain/customer.entity';
import { CustomerService } from '../../service/customer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Between, Like } from 'typeorm';
import { User } from '../../domain/user.entity';

@Controller('api/customers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('customers')
export class CustomerController {
    logger = new Logger('CustomerController');

    constructor(private readonly customerService: CustomerService) {}

    @Get('/birthday')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Customer,
    })
    async getBirthdayAll(@Req() req: Request): Promise<Customer[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const next7Days = new Date();
        const [results, count] = await this.customerService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                dateOfBirth: Between(new Date(), new Date(new Date().setDate(new Date().getDate() + 7))),
                ...filter,
            },
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Customer,
    })
    async getAll(@Req() req: Request): Promise<Customer[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.customerService.findAndCount({
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
        type: Customer,
    })
    async getOne(@Param('id') id: string): Promise<Customer> {
        return await this.customerService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create customer' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Customer,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() customer: Customer): Promise<Customer> {
        const currentUser = req.user as User;
        customer.department = currentUser.department
        const created = await this.customerService.save(customer);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Customer', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update customer' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Customer,
    })
    async put(@Req() req: Request, @Body() customer: Customer): Promise<Customer> {
        HeaderUtil.addEntityUpdatedHeaders(req.res, 'Customer', customer.id);
        return await this.customerService.update(customer);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete customer' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Customer> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Customer', id);
        const toDelete = await this.customerService.findById(id);
        return await this.customerService.delete(toDelete);
    }
}
