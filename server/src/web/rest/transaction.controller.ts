import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Transaction from '../../domain/transaction.entity';
import { TransactionService } from '../../service/transaction.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class TransactionController {
    logger = new Logger('TransactionController');

    constructor(private readonly transactionService: TransactionService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Transaction,
    })
    async getAll(@Req() req: Request): Promise<Transaction[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.transactionService.findAndCount({
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
        type: Transaction,
    })
    async getOne(@Param('id') id: string): Promise<Transaction> {
        return await this.transactionService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Transaction,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() transaction: Transaction): Promise<Transaction> {
        const created = await this.transactionService.save(transaction);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Transaction', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Transaction,
    })
    async put(@Req() req: Request, @Body() transaction: Transaction): Promise<Transaction> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Transaction', transaction.id);
        return await this.transactionService.update(transaction);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Transaction> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Transaction', id);
        const toDelete = await this.transactionService.findById(id);
        return await this.transactionService.delete(toDelete);
    }
}
