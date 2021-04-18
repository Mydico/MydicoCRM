import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Fanpage from '../../domain/fanpage.entity';
import { FanpageService } from '../../service/fanpage.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/fanpages')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('fanpages')
export class FanpageController {
    logger = new Logger('FanpageController');

    constructor(private readonly fanpageService: FanpageService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Fanpage,
    })
    async getAll(@Req() req: Request): Promise<Fanpage[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.fanpageService.findAndCount({
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
        type: Fanpage,
    })
    async getOne(@Param('id') id: string): Promise<Fanpage> {
        return await this.fanpageService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create fanpage' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Fanpage,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() fanpage: Fanpage): Promise<Fanpage> {
        const created = await this.fanpageService.save(fanpage);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Fanpage', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update fanpage' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Fanpage,
    })
    async put(@Req() req: Request, @Body() fanpage: Fanpage): Promise<Fanpage> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Fanpage', fanpage.id);
        return await this.fanpageService.update(fanpage);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete fanpage' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Fanpage> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Fanpage', id);
        const toDelete = await this.fanpageService.findById(id);
        return await this.fanpageService.delete(toDelete);
    }
}
