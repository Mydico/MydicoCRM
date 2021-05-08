import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerTemp from '../../domain/customer-temp.entity';
import { CustomerTempService } from '../../service/customer-temp.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-temps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerTempController {
    logger = new Logger('CustomerTempController');

    constructor(private readonly customerTempService: CustomerTempService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerTemp,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerTemp[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerTempService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CustomerTemp,
    })
    async getOne(@Param('id') id: string): Promise<CustomerTemp> {
        return await this.customerTempService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerTemp,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerTemp: CustomerTemp): Promise<CustomerTemp> {
        const created = await this.customerTempService.save(customerTemp);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerTemp', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerTemp,
    })
    async put(@Res() res: Response, @Body() customerTemp: CustomerTemp): Promise<CustomerTemp> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerTemp', customerTemp.id);
        return await this.customerTempService.update(customerTemp);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerTemp> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerTemp', id);
        const toDelete = await this.customerTempService.findById(id);
        return await this.customerTempService.delete(toDelete);
    }
}
