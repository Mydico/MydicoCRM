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
import InternalNotification from '../../domain/internal-notification.entity';
import { InternalNotificationService } from '../../service/internal-notification.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, PermissionGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { NotificationService } from '../../service/notification.service';

@Controller('api/internal-notifications')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class InternalNotificationController {
    logger = new Logger('InternalNotificationController');

    constructor(private readonly internalNotificationService: InternalNotificationService, private readonly notificationService: NotificationService) {}

    @Get('/notifications')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: InternalNotification,
    })
    async getNotifcation(@Req() req: Request, @Res() res): Promise<InternalNotification[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const currentUser = req.user as User;
        const [results, count] = await this.notificationService.findAndCount({
            where: {
                type: 'INTERNAL',
                user: currentUser
            },
            skip: pageRequest.size * pageRequest.page,
            take: pageRequest.size,
            order: pageRequest.sort.asOrder()
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: InternalNotification,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<InternalNotification[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const currentUser = req.user as User;
        const [results, count] = await this.internalNotificationService.findAndCount(pageRequest, req, currentUser);
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }
    

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: InternalNotification,
    })
    async getOne(@Param('id') id: string, @Res() res): Promise<InternalNotification> {
        return res.send(await this.internalNotificationService.findById(id));
    }

    @PostMethod('/send')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: InternalNotification,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async send(@Req() req: Request, @Res() res: Response, @Body() internalNotification: InternalNotification): Promise<Response> {
        const currentUser = req.user as User;
        internalNotification.createdBy = currentUser.login
        await this.internalNotificationService.send(internalNotification);
        return res.send();
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: InternalNotification,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Res() res: Response, @Body() internalNotification: InternalNotification): Promise<Response> {
        const currentUser = req.user as User;
        internalNotification.createdBy = currentUser.login
        const created = await this.internalNotificationService.save(internalNotification);
        
        HeaderUtil.addEntityCreatedHeaders(res, 'InternalNotification', created.id);
        return res.send(created);
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: InternalNotification,
    })
    async approve(@Res() res: Response, @Body() internalNotification: InternalNotification): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'InternalNotification', internalNotification.id);
        return res.send(await this.internalNotificationService.update(internalNotification));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Response> {
        const toDelete = await this.internalNotificationService.findById(id);
        return res.send(await this.internalNotificationService.delete(toDelete));
    }
}
