import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import StoreHistory from '../../domain/store-history.entity';
import { StoreHistoryService } from '../../service/store-history.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/store-histories')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class StoreHistoryController {
    logger = new Logger('StoreHistoryController');

    constructor(private readonly storeHistoryService: StoreHistoryService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: StoreHistory,
    })
    async getAll(@Req() req: Request): Promise<StoreHistory[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.storeHistoryService.findAndCount({
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
        type: StoreHistory,
    })
    async getOne(@Param('id') id: string): Promise<StoreHistory> {
        return await this.storeHistoryService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: StoreHistory,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() storeHistory: StoreHistory): Promise<StoreHistory> {
        const created = await this.storeHistoryService.save(storeHistory);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'StoreHistory', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: StoreHistory,
    })
    async put(@Req() req: Request, @Body() storeHistory: StoreHistory): Promise<StoreHistory> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'StoreHistory', storeHistory.id);
        return await this.storeHistoryService.update(storeHistory);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<StoreHistory> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'StoreHistory', id);
        const toDelete = await this.storeHistoryService.findById(id);
        return await this.storeHistoryService.delete(toDelete);
    }
}
