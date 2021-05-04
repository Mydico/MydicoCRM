import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Store from '../../domain/store.entity';
import { StoreService } from '../../service/store.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { In, Like } from 'typeorm';

@Controller('api/stores')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class StoreController {
    logger = new Logger('StoreController');

    constructor(private readonly storeService: StoreService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Store,
    })
    async getAll(@Req() req: Request): Promise<Store[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const options = {
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                ...filter,
            },
        };
        const [results, count] = await this.storeService.findAndCount(options, req);
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Store,
    })
    async getOne(@Param('id') id: string): Promise<Store> {
        return await this.storeService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Store,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() store: Store): Promise<Store> {
        const created = await this.storeService.save(store);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Store', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Store,
    })
    async put(@Req() req: Request, @Body() store: Store): Promise<Store> {
        HeaderUtil.addEntityUpdatedHeaders(req.res, 'Store', store.id);
        return await this.storeService.update(store);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Store> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Store', id);
        const toDelete = await this.storeService.findById(id);
        return await this.storeService.delete(toDelete);
    }
}
