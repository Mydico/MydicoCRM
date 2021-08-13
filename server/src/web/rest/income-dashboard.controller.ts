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
    CacheInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import IncomeDashboard from '../../domain/income-dashboard.entity';
import { IncomeDashboardService } from '../../service/income-dashboard.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Between, Equal } from 'typeorm';

@Controller('api/income-dashboards')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class IncomeDashboardController {
    logger = new Logger('IncomeDashboardController');

    constructor(private readonly incomeDashboardService: IncomeDashboardService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: IncomeDashboard,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<IncomeDashboard[]> {
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'startDate' && item !== 'endDate') {
                filter[item] = req.query[item];
            }
        });
        const where = {
            ...filter,
        };
        if (req.query.startDate && req.query.endDate) {
            where['createdDate'] = Between(req.query.startDate, req.query.endDate);
        }
        const [results, count] = await this.incomeDashboardService.findAndCount({
            where,
            cache: 3*3600
        });
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: IncomeDashboard,
    })
    async getOne(@Param('id') id: string): Promise<IncomeDashboard> {
        return await this.incomeDashboardService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: IncomeDashboard,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() incomeDashboard: IncomeDashboard): Promise<IncomeDashboard> {
        const created = await this.incomeDashboardService.save(incomeDashboard);
        HeaderUtil.addEntityCreatedHeaders(res, 'IncomeDashboard', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: IncomeDashboard,
    })
    async put(@Res() res: Response, @Body() incomeDashboard: IncomeDashboard): Promise<IncomeDashboard> {
        HeaderUtil.addEntityCreatedHeaders(res, 'IncomeDashboard', incomeDashboard.id);
        return await this.incomeDashboardService.update(incomeDashboard);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<IncomeDashboard> {
        HeaderUtil.addEntityDeletedHeaders(res, 'IncomeDashboard', id);
        const toDelete = await this.incomeDashboardService.findById(id);
        return await this.incomeDashboardService.delete(toDelete);
    }
}
