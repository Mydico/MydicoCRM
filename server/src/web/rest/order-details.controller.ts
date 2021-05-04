import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import OrderDetails from '../../domain/order-details.entity';
import { OrderDetailsService } from '../../service/order-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/order-details')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class OrderDetailsController {
    logger = new Logger('OrderDetailsController');

    constructor(private readonly orderDetailsService: OrderDetailsService) {}

    @Get('/order')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: OrderDetails,
    })
    async getByOrderId(@Req() req: Request): Promise<OrderDetails[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.orderDetailsService.findAndCountByOrderId({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                order: req.query.orderId,
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
        type: OrderDetails,
    })
    async getAll(@Req() req: Request): Promise<OrderDetails[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.orderDetailsService.findAndCount({
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
        type: OrderDetails,
    })
    async getOne(@Param('id') id: string): Promise<OrderDetails> {
        return await this.orderDetailsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: OrderDetails,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() orderDetails: OrderDetails): Promise<OrderDetails> {
        const created = await this.orderDetailsService.save(orderDetails);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'OrderDetails', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: OrderDetails,
    })
    async put(@Req() req: Request, @Body() orderDetails: OrderDetails): Promise<OrderDetails> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'OrderDetails', orderDetails.id);
        return await this.orderDetailsService.update(orderDetails);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<OrderDetails> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'OrderDetails', id);
        const toDelete = await this.orderDetailsService.findById(id);
        return await this.orderDetailsService.delete(toDelete);
    }
}
