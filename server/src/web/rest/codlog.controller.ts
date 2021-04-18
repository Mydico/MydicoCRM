import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Codlog from '../../domain/codlog.entity';
import { CodlogService } from '../../service/codlog.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/codlogs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('codlogs')
export class CodlogController {
    logger = new Logger('CodlogController');

    constructor(private readonly codlogService: CodlogService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Codlog,
    })
    async getAll(@Req() req: Request): Promise<Codlog[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.codlogService.findAndCount({
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
        type: Codlog,
    })
    async getOne(@Param('id') id: string): Promise<Codlog> {
        return await this.codlogService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create codlog' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Codlog,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() codlog: Codlog): Promise<Codlog> {
        const created = await this.codlogService.save(codlog);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Codlog', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update codlog' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Codlog,
    })
    async put(@Req() req: Request, @Body() codlog: Codlog): Promise<Codlog> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Codlog', codlog.id);
        return await this.codlogService.update(codlog);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete codlog' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Codlog> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Codlog', id);
        const toDelete = await this.codlogService.findById(id);
        return await this.codlogService.delete(toDelete);
    }
}
