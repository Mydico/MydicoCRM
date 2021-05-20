import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import ReportDate from '../../domain/report-date.entity';
import { ReportDateService } from '../../service/report-date.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/report-dates')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class ReportDateController {
    logger = new Logger('ReportDateController');

    constructor(private readonly reportDateService: ReportDateService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ReportDate,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<ReportDate[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.reportDateService.findAndCount({
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
        type: ReportDate,
    })
    async getOne(@Param('id') id: string): Promise<ReportDate> {
        return await this.reportDateService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ReportDate,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() reportDate: ReportDate): Promise<ReportDate> {
        const created = await this.reportDateService.save(reportDate);
        HeaderUtil.addEntityCreatedHeaders(res, 'ReportDate', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ReportDate,
    })
    async put(@Res() res: Response, @Body() reportDate: ReportDate): Promise<ReportDate> {
        HeaderUtil.addEntityCreatedHeaders(res, 'ReportDate', reportDate.id);
        return await this.reportDateService.update(reportDate);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<ReportDate> {
        HeaderUtil.addEntityDeletedHeaders(res, 'ReportDate', id);
        const toDelete = await this.reportDateService.findById(id);
        return await this.reportDateService.delete(toDelete);
    }
}
