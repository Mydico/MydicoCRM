import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TransportLog from '../../domain/transport-log.entity';
import { TransportLogService } from '../../service/transport-log.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transport-logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('transport-logs')
export class TransportLogController {
    logger = new Logger('TransportLogController');

    constructor(private readonly transportLogService: TransportLogService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TransportLog,
    })
    async getAll(@Req() req: Request): Promise<TransportLog[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.transportLogService.findAndCount({
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
        type: TransportLog,
    })
    async getOne(@Param('id') id: string): Promise<TransportLog> {
        return await this.transportLogService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create transportLog' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TransportLog,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() transportLog: TransportLog): Promise<TransportLog> {
        const created = await this.transportLogService.save(transportLog);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransportLog', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update transportLog' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransportLog,
    })
    async put(@Req() req: Request, @Body() transportLog: TransportLog): Promise<TransportLog> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransportLog', transportLog.id);
        return await this.transportLogService.update(transportLog);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete transportLog' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<TransportLog> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'TransportLog', id);
        const toDelete = await this.transportLogService.findById(id);
        return await this.transportLogService.delete(toDelete);
    }
}
