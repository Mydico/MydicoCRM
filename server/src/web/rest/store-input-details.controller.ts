import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import StoreInputDetails from '../../domain/store-input-details.entity';
import { StoreInputDetailsService } from '../../service/store-input-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/store-input-details')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('store-input-details')
export class StoreInputDetailsController {
    logger = new Logger('StoreInputDetailsController');

    constructor(private readonly storeInputDetailsService: StoreInputDetailsService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: StoreInputDetails,
    })
    async getAll(@Req() req: Request): Promise<StoreInputDetails[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.storeInputDetailsService.findAndCount({
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
        type: StoreInputDetails,
    })
    async getOne(@Param('id') id: string): Promise<StoreInputDetails> {
        return await this.storeInputDetailsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create storeInputDetails' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: StoreInputDetails,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() storeInputDetails: StoreInputDetails): Promise<StoreInputDetails> {
        const created = await this.storeInputDetailsService.save(storeInputDetails);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'StoreInputDetails', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update storeInputDetails' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: StoreInputDetails,
    })
    async put(@Req() req: Request, @Body() storeInputDetails: StoreInputDetails): Promise<StoreInputDetails> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'StoreInputDetails', storeInputDetails.id);
        return await this.storeInputDetailsService.update(storeInputDetails);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete storeInputDetails' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<StoreInputDetails> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'StoreInputDetails', id);
        const toDelete = await this.storeInputDetailsService.findById(id);
        return await this.storeInputDetailsService.delete(toDelete);
    }
}
