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
import Notification from '../../domain/notification.entity';
import { NotificationService } from '../../service/notification.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';
import { User } from 'src/domain/user.entity';

@Controller('api/notifications')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class NotificationController {
    logger = new Logger('NotificationController');

    constructor(private readonly notificationService: NotificationService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Notification,
    })
    async getAll(@Req() req, @Res() res): Promise<Notification[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const currentUser = req.user as User;

        const [results, count] = await this.notificationService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                ...filter,
                user:currentUser,
            },
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Notification,
    })
    async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        return res.send(await this.notificationService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Notification,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() notification: Notification): Promise<Response> {
        const created = await this.notificationService.save(notification);
        HeaderUtil.addEntityCreatedHeaders(res, 'Notification', created.id);
        return res.send(created);
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Notification,
    })
    async put(@Res() res: Response, @Body() notification: Notification): Promise<Response> {
        HeaderUtil.addEntityCreatedHeaders(res, 'Notification', notification.id);
        return res.send(await this.notificationService.update(notification));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Response> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Notification', id);
        const toDelete = await this.notificationService.findById(id);
        return res.send(await this.notificationService.delete(toDelete));
    }
}
