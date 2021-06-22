import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerToken from '../../domain/customer-token.entity';
import { CustomerTokenService } from '../../service/customer-token.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/customer-tokens')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class CustomerTokenController {
    logger = new Logger('CustomerTokenController');

    constructor(private readonly customerTokenService: CustomerTokenService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerToken,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerToken[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerTokenService.findAndCount({
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
        type: CustomerToken,
    })
    async getOne(@Param('id') id: string): Promise<CustomerToken> {
        return await this.customerTokenService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)

    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerToken,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerToken: CustomerToken): Promise<CustomerToken> {
        const created = await this.customerTokenService.save(customerToken);
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerToken', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)

    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerToken,
    })
    async put(@Res() res: Response, @Body() customerToken: CustomerToken): Promise<CustomerToken> {
        HeaderUtil.addEntityCreatedHeaders(res, 'CustomerToken', customerToken.id);
        return await this.customerTokenService.update(customerToken);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)

    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerToken> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerToken', id);
        const toDelete = await this.customerTokenService.findById(id);
        return await this.customerTokenService.delete(toDelete);
    }
}
