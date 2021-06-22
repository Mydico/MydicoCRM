import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Transaction from '../../domain/transaction.entity';
import { TransactionService } from '../../service/transaction.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Equal, Like } from 'typeorm';

@Controller('api/transactions')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class TransactionController {
    logger = new Logger('TransactionController');

    constructor(private readonly transactionService: TransactionService) {}

    @Get('/')
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Transaction,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<Transaction[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
                filter[item] = Equal(`${req.query[item]}`);
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
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Transaction,
    })
    async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        return res.send(await this.transactionService.findById(id));
    }

    @PostMethod('/')
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Transaction,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() transaction: Transaction): Promise<Response> {
        const created = await this.transactionService.save(transaction);
        HeaderUtil.addEntityCreatedHeaders(res, 'Transaction', created.id);
        return res.send(created);
    }

    @Put('/')
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Transaction,
    })
    async put(@Res() res: Response, @Body() transaction: Transaction): Promise<Response> {
        HeaderUtil.addEntityCreatedHeaders(res, 'Transaction', transaction.id);
        return res.send(await this.transactionService.update(transaction));
    }

    @Delete('/:id')
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Transaction> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Transaction', id);
        const toDelete = await this.transactionService.findById(id);
        return await this.transactionService.delete(toDelete);
    }
}
